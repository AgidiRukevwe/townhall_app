import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";
import { useOfficialModalStore } from "@/store/official-modal-store";
import { useSelectedOfficialStore } from "@/store/selected-official-store";
import { getInitials } from "@/utils/get-initials";
import { toTitleCase } from "@/utils/to-title-case";
import { truncateText } from "@/utils/truncate-text";
import { Official } from "@shared/schema";
import React from "react";
import { OfficialAvatar } from "../officials/official-avatar";

interface ProfileHeaderProps {
  official: Official;
}

function ProfileHeader() {
  const { isOpen: profileModal } = useOfficialModalStore();
  const isMobile = useBreakpoint();
  const { official } = useSelectedOfficialStore();
  return (
    <>
      {!profileModal ? (
        <div className="flex flex-row md:flex-col items-center gap-x-2 ">
          <OfficialAvatar
            official={{
              imageUrl: official?.imageUrl,
              approvalRating: official?.approvalRating as number,
              name: official?.name as string,
            }}
            size={isMobile ? "md" : "lg"}
            // showAvatar={true}
          />

          {/* Official name and position */}
          <div className="flex flex-col md:gap-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {toTitleCase(official?.name ?? "")}
            </h2>
            <p className="text-text-secondary md:mb-6 text-sm truncate">
              {truncateText(official?.location ?? "", 30)}
              {/* jj */}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-x-4">
          <OfficialAvatar
            official={{
              imageUrl: official?.imageUrl,
              approvalRating: official?.approvalRating as number,
              name: official?.name as string,
            }}
            size={isMobile ? "md" : "lg"}
            // showAvatar={false}
          />

          {/* Official name and position */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-xl font-semibold text-text-primary">
              {toTitleCase(official?.name ?? "")}
            </h2>
            <p className="text-text-secondary mb-6 text-sm truncate">
              {truncateText(official?.location ?? "", 35)}
              {/* {official.location} */}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileHeader;
