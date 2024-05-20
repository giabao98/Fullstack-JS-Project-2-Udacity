import express, { Request, Response } from "express";
import authMiddleware from "../../middleware/auth";
import { OrderStore, Order } from "../../models/orders";

const router = express.Router();
const store = new OrderStore();

// Fetch all orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await store.getAllOrders();
    res
      .status(200)
      .json({ message: "Orders retrieved successfully", data: orders });
  } catch (error) {
    res.status(500).json({ status: 500, message: `Error: ${error}` });
  }
});

// Fetch orders by user ID
router.get(
  "/user/:userId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "User ID must be a number" });
    }

    try {
      const orders = await store.getOrdersByUser(userId);
      res.status(200).json({
        message: "Orders for user retrieved successfully",
        data: orders,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error: ${error}` });
    }
  }
);

// Fetch completed orders by user ID
router.get(
  "/user/:userId/order",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "User ID must be a number" });
    }

    try {
      const completedOrders = await store.getCompletedOrdersByUser(userId);
      res.status(200).json({
        message: "Completed orders for user retrieved successfully",
        data: completedOrders,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error: ${error}` });
    }
  }
);

// Create a new order
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { product_id, user_id, quantity } = req.body;

  if (!product_id || !user_id || !quantity) {
    return res
      .status(400)
      .json({ message: "Product ID, user ID, and quantity are required" });
  }

  if (quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive number" });
  }

  const newOrder: Order = {
    product_id: parseInt(product_id),
    user_id: parseInt(user_id),
    quantity,
    status: "active",
  };

  try {
    const createdOrder = await store.createOrder(newOrder);
    res
      .status(201)
      .json({ message: "Order created successfully", data: createdOrder });
  } catch (error) {
    res.status(500).json({ status: 500, message: `Error: ${error}` });
  }
});

// Update order status to complete
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Order ID must be a number" });
  }

  try {
    const updatedOrder = await store.updateOrderStatusToComplete(orderId);
    res.status(200).json({
      message: "Order status updated to complete",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: `Error: ${error}` });
  }
});

export default router;
