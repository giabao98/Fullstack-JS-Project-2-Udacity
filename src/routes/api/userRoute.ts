import express, { Request, Response } from "express";
import { User, UserStore } from "../../models/users";
import authMiddleware from "../../middleware/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const userStoreInstance = new UserStore();
const secretToken = process.env.SECRET_TOKEN as string;

// Utility function to get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Retrieve all users
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token) {
      jwt.verify(token, secretToken);
    } else {
      return res.status(401).send({ message: "Authorization token missing" });
    }
  } catch (error) {
    return res
      .status(401)
      .send({ message: `Unauthorized: ${getErrorMessage(error)}` });
  }

  try {
    const allUsers = await userStoreInstance.index();
    res
      .status(200)
      .json({ message: "User list retrieved successfully", data: allUsers });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Internal Server Error: ${getErrorMessage(error)}` });
  }
});

// Retrieve a specific user by ID
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  try {
    const user = await userStoreInstance.showUserInfo(userId);
    res
      .status(200)
      .json({ message: "User info retrieved successfully", data: user });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Internal Server Error: ${getErrorMessage(error)}` });
  }
});

// User registration
router.post("/signUp", async (req: Request, res: Response) => {
  const { first_name, last_name, userName, password } = req.body;
  const newUser: User = {
    firstName: first_name,
    lastName: last_name,
    userName,
    password,
  };

  if (!first_name || !last_name || !userName || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const registeredUser = await userStoreInstance.createUser(newUser);
    res
      .status(201)
      .json({ message: "User registered successfully", token: registeredUser });
  } catch (error) {
    res
      .status(422)
      .json({ message: `Unprocessable Entity: ${getErrorMessage(error)}` });
  }
});

// Admin: Create new user
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { first_name, last_name, userName, password } = req.body;
  const newUser: User = {
    firstName: first_name,
    lastName: last_name,
    userName,
    password,
  };

  if (!first_name || !last_name || !userName || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const createdUser = await userStoreInstance.createUser(newUser);
    res
      .status(201)
      .json({ message: "User created successfully", data: createdUser });
  } catch (error) {
    res
      .status(422)
      .json({ message: `Unprocessable Entity: ${getErrorMessage(error)}` });
  }
});

// User login/authentication
router.post("/authenticate", async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }

  try {
    const authenticatedUser = await userStoreInstance.authenticate(
      userName,
      password
    );
    res
      .status(200)
      .json({ message: "Login successful", token: authenticatedUser });
  } catch (error) {
    res.status(403).json({ message: `Forbidden: ${getErrorMessage(error)}` });
  }
});

export default router;
