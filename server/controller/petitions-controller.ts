import { Request, Response } from "express";

export const postPetition = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Petitions feature coming soon" });
};
