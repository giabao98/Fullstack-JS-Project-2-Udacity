import express, { Request, Response } from "express";
import { Product, ProductStore } from "../../models/products";
import authMiddleware from "../../middleware/auth";

const productRouter = express.Router();
const store = new ProductStore();

// Fetch all products
productRouter.get("/", async (req: Request, res: Response) => {
  try {
    const products = await store.getAllProducts();
    res
      .status(200)
      .json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    res.status(500).json({ status: 500, message: `Error: ${error}` });
  }
});

// Fetch a single product by ID
productRouter.get("/:id", async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Product ID must be a number" });
  }

  try {
    const product = await store.getProductById(productId);
    res
      .status(200)
      .json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    res.status(500).json({ status: 500, message: `Error: ${error}` });
  }
});

// Create a new product
productRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { name, price, category } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ message: "Product name and price are required" });
  }

  const newProduct: Product = { name, price, category };

  try {
    const createdProduct = await store.createNewProduct(newProduct);
    res
      .status(201)
      .json({ message: "Product created successfully", data: createdProduct });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
});

// Fetch products by category
productRouter.get(
  "/category/:category",
  async (req: Request, res: Response) => {
    const category = req.params.category;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category parameter is required" });
    }

    try {
      const products = await store.getProductsByCategory(category);
      res.status(200).json({
        message: "Products by category retrieved successfully",
        data: products,
      });
    } catch (error) {
      res.status(500).json({ message: `Error: ${error}` });
    }
  }
);

export default productRouter;
