import express from "express";
import productRoutes from "../routes/api/productRoute";
import userRoutes from "./api/userRoute";
import orderRoutes from "./api/orderRoute";

const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.send("Welcome to the Udacity Project 2 API");
});

// Product routes
router.use("/products", productRoutes);

// User routes
router.use("/users", userRoutes);

// Order routes
router.use("/orders", orderRoutes);

export default router;
