import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const secretKey = process.env.SECRET_TOKEN as string;

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, secretKey);
      next();
    } else {
      res.status(401).json({ message: "Token not provided" });
    }
  } catch (error) {
    res.status(401).json({ message: "Access denied! Invalid token" });
  }
};

export default authenticate;
