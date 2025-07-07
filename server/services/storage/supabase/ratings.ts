import { randomUUID } from "crypto";

import { RatingPayload, RatingSummary } from "@shared/schema";
import { supabase } from "server/supabase-client";
import { generateTimeBasedData } from "server/utils/ratings";
import { transformToSectorPeriodData } from "server/utils/ratings/get-sector-period-ratings";

export const Ratings = {
  async getOfficialRatings(officialId: string): Promise<RatingSummary> {
    const { data: allRatings, error: allRatingsError } = await supabase
      .from("ratings")
      .select("id, rating, sector_id, user_id, created_at")
      .eq("leader_id", officialId);

    if (allRatingsError) throw allRatingsError;

    if (!allRatings || allRatings.length === 0) {
      return {
        overallRating: 0,
        monthlyChange: 0,
        monthlyData: [],
        sectorAverage: 0,
        sectorMonthlyChange: 0,
        sectorRatings: [],
        timeData: {
          periods: {
            "1 Dy": { label: [""], data: [] },
            "1 Wk": { label: [""], data: [] },
            "1 Yr": { label: [""], data: [] },
            "This year": { label: [""], data: [] },
          },
          sectorData: {
            "1 Dy": {},
            "1 Wk": {},
            "1 Yr": {},
            "This year": {},
          },
        },
        sectorPeriodRating: {},
      };
    }

    const overallRatings = allRatings.filter(
      (r) =>
        !r.sector_id || r.sector_id === "00000000-0000-0000-0000-000000000000"
    );

    const sectorRatingsRaw = allRatings.filter(
      (r) =>
        r.sector_id && r.sector_id !== "00000000-0000-0000-0000-000000000000"
    );

    const overallRating = Math.round(
      overallRatings.reduce((sum, r) => sum + r.rating, 0) /
        overallRatings.length
    );

    const currentDate = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let previousMonthRating = overallRating;
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthIdx = date.getMonth();
      const year = date.getFullYear();

      const monthRatings = overallRatings.filter((r) => {
        const ratingDate = new Date(r.created_at);
        return (
          ratingDate.getFullYear() === year &&
          ratingDate.getMonth() === monthIdx
        );
      });

      const monthlyRating =
        monthRatings.length > 0
          ? Math.round(
              monthRatings.reduce((sum, r) => sum + r.rating, 0) /
                monthRatings.length
            )
          : previousMonthRating;

      previousMonthRating = monthlyRating;

      monthlyData.push({
        month: `${monthNames[monthIdx]} ${year}`,
        rating: monthlyRating,
        isCurrentMonth: i === 0,
      });
    }

    const monthlyChange =
      monthlyData.length >= 2
        ? monthlyData[monthlyData.length - 1].rating -
          monthlyData[monthlyData.length - 2].rating
        : 0;

    const { data: sectorData, error: sectorError } = await supabase
      .from("leader_sectors")
      .select("*")
      .eq("leader_id", officialId);

    if (sectorError) throw sectorError;

    const sectorColors = [
      "#4CAF50",
      "#FFC107",
      "#2196F3",
      "#E91E63",
      "#673AB7",
    ];

    const sectorRatings = sectorData.map((sector, index) => {
      const relevantRatings = sectorRatingsRaw.filter(
        (r) => r.sector_id === sector.id
      );

      const rating =
        relevantRatings.length > 0
          ? Math.round(
              relevantRatings.reduce((sum, r) => sum + r.rating, 0) /
                relevantRatings.length
            )
          : overallRating;

      return {
        name: sector.name,
        rating,
        color: sectorColors[index % sectorColors.length],
      };
    });

    const sectorAverage = parseFloat(
      (
        sectorRatings.reduce((sum, s) => sum + s.rating, 0) /
        sectorRatings.length
      ).toFixed(1)
    );

    const formattedRatings = allRatings.map((r) => {
      const sectorInfo = sectorData.find((s) => s.id === r.sector_id);
      const name = sectorInfo?.name || "";
      const color =
        sectorColors[
          sectorRatings.findIndex((s) => s.name === name) % sectorColors.length
        ] || "#BDBDBD";

      return {
        id: r.id,
        officialId,
        userId: r.user_id || "anonymous",
        overallRating: r.rating,
        sectorId: r.sector_id,
        sectorName: name,
        sectorColor: color,
        rating: r.rating,
        createdAt: new Date(r.created_at),
      };
    });

    const sectorInfoForTimeData = sectorRatings.map((s) => ({
      id: s.name.toLowerCase().replace(/\s+/g, "_"),
      name: s.name,
      color: s.color,
    }));

    const timeData = generateTimeBasedData(
      formattedRatings,
      sectorInfoForTimeData
    );

    const sectorPeriodRating = transformToSectorPeriodData(timeData.sectorData);

    return {
      overallRating,
      monthlyChange,
      monthlyData,
      sectorAverage,
      sectorMonthlyChange: parseFloat(monthlyChange.toFixed(1)),
      sectorRatings,
      sectorPeriodRating,
      timeData,
    };
  },

  // async submitRating(
  //   ratingData: RatingPayload & { userId: string }
  // ): Promise<{ success: boolean }> {
  //   const { data: existingRatings } = await supabase
  //     .from("ratings")
  //     .select("id")
  //     .eq("leader_id", ratingData.officialId)
  //     .eq("user_id", ratingData.userId);

  //   if (existingRatings?.length) {
  //     for (const r of existingRatings) {
  //       await supabase.from("ratings").delete().eq("id", r.id);
  //     }
  //   }

  //   const { data: sectors, error: sectorErr } = await supabase
  //     .from("sectors")
  //     .select("id, name");

  //   if (sectorErr) throw sectorErr;

  //   const defaultSector = sectors.find((s) => s.name === "Overall") || {
  //     id: "00000000-0000-0000-0000-000000000000",
  //   };

  //   await supabase.from("ratings").insert({
  //     id: randomUUID(),
  //     leader_id: ratingData.officialId,
  //     user_id: ratingData.userId,
  //     rating: ratingData.overallRating,
  //     sector_id: defaultSector.id,
  //     created_at: new Date().toISOString(),
  //   });

  //   for (const sr of ratingData.sectorRatings || []) {
  //     if (sr.sectorId === defaultSector.id) continue;
  //     await supabase.from("ratings").insert({
  //       id: randomUUID(),
  //       leader_id: ratingData.officialId,
  //       user_id: ratingData.userId,
  //       rating: sr.rating,
  //       sector_id: sr.sectorId,
  //       created_at: new Date().toISOString(),
  //     });
  //   }

  //   return { success: true };
  // },

  async submitRating(
    ratingData: RatingPayload & { userId: string }
  ): Promise<{ success: boolean }> {
    const { officialId, userId, overallRating, sectorRatings } = ratingData;

    // 1. Delete all previous ratings for this user + official in one go
    await supabase
      .from("ratings")
      .delete()
      .match({ leader_id: officialId, user_id: userId });

    // 2. Get sector list once
    const { data: sectors, error: sectorErr } = await supabase
      .from("sectors")
      .select("id, name");

    if (sectorErr) throw sectorErr;

    const defaultSector = sectors.find((s) => s.name === "Overall") || {
      id: "00000000-0000-0000-0000-000000000000",
    };

    // 3. Prepare all ratings for bulk insert
    const allRatings = [
      {
        id: randomUUID(),
        leader_id: officialId,
        user_id: userId,
        rating: overallRating,
        sector_id: defaultSector.id,
        created_at: new Date().toISOString(),
      },
      ...sectorRatings
        .filter((sr) => sr.sectorId !== defaultSector.id)
        .map((sr) => ({
          id: randomUUID(),
          leader_id: officialId,
          user_id: userId,
          rating: sr.rating,
          sector_id: sr.sectorId,
          created_at: new Date().toISOString(),
        })),
    ];

    // 4. Insert all ratings at once
    await supabase.from("ratings").insert(allRatings);

    return { success: true };
  },
};
