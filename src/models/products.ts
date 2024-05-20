import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async getAllProducts(): Promise<Product[]> {
    const client = await pool.connect();
    try {
      const query = "SELECT * FROM products";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve products: ${error}`);
    } finally {
      client.release();
    }
  }

  async getProductById(productId: number): Promise<Product> {
    const client = await pool.connect();
    try {
      const query = "SELECT * FROM products WHERE id = $1";
      const result = await client.query(query, [productId]);
      if (result.rows.length) {
        return result.rows[0];
      } else {
        throw new Error(`Product with ID ${productId} not found`);
      }
    } catch (error) {
      throw new Error(`Unable to retrieve product: ${error}`);
    } finally {
      client.release();
    }
  }

  async createNewProduct(product: Product): Promise<Product> {
    const client = await pool.connect();
    try {
      const query =
        "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *";
      const result = await client.query(query, [
        product.name,
        product.price,
        product.category,
      ]);
      if (result.rows.length) {
        return result.rows[0];
      } else {
        throw new Error("Failed to create new product");
      }
    } catch (error) {
      throw new Error(`Unable to create product: ${error}`);
    } finally {
      client.release();
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const client = await pool.connect();
    try {
      const query = "SELECT * FROM products WHERE category ILIKE $1";
      const result = await client.query(query, [`%${category}%`]);
      if (result.rows.length) {
        return result.rows;
      } else {
        throw new Error(`No products found in category ${category}`);
      }
    } catch (error) {
      throw new Error(`Unable to retrieve products by category: ${error}`);
    } finally {
      client.release();
    }
  }
}
