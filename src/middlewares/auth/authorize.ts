import { Request, Response, NextFunction } from "express";

export const authorize = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body.user) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden. User not authorized." });
  }
};
