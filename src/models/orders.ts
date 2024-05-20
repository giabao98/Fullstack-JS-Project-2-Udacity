import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export type Order = {
  id?: number;
  product_id: number;
  user_id: number;
  quantity: number;
  status: string;
};

export class OrderStore {
  async getAllOrders(): Promise<Order[]> {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM orders";
      const result = await client.query(sql);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve orders: ${error}`);
    } finally {
      client.release();
    }
  }

  async createOrder(order: Order): Promise<Order> {
    const client = await pool.connect();
    try {
      const sql = `
        WITH new_order AS (
          INSERT INTO orders (product_id, quantity, user_id, status)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        )
        INSERT INTO order_product (order_id, product_id)
        VALUES ((SELECT id FROM new_order), (SELECT product_id FROM new_order))
        RETURNING *;
      `;
      const result = await client.query(sql, [
        order.product_id,
        order.quantity,
        order.user_id,
        order.status,
      ]);
      if (result.rows.length) {
        return result.rows[0];
      } else {
        throw new Error("Order creation failed");
      }
    } catch (error) {
      throw new Error(`Unable to create order: ${error}`);
    } finally {
      client.release();
    }
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const client = await pool.connect();
    try {
      const sql = `
        SELECT orders.id, orders.product_id, orders.user_id, orders.quantity, orders.status
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        WHERE users.id = $1
      `;
      const result = await client.query(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve orders for user ${userId}: ${error}`);
    } finally {
      client.release();
    }
  }

  async getCompletedOrdersByUser(userId: number): Promise<Order[]> {
    const client = await pool.connect();
    try {
      const sql = `
        SELECT orders.id, orders.product_id, orders.user_id, orders.quantity, orders.status
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        WHERE users.id = $1 AND orders.status = 'complete'
      `;
      const result = await client.query(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(
        `Unable to retrieve completed orders for user ${userId}: ${error}`
      );
    } finally {
      client.release();
    }
  }

  async updateOrderStatusToComplete(orderId: number): Promise<Order> {
    const client = await pool.connect();
    try {
      const sql = `
        UPDATE orders
        SET status = 'complete'
        WHERE id = $1
        RETURNING *;
      `;
      const result = await client.query(sql, [orderId]);
      if (result.rows.length) {
        return result.rows[0];
      } else {
        throw new Error("Order status update failed");
      }
    } catch (error) {
      throw new Error(`Unable to update order status: ${error}`);
    } finally {
      client.release();
    }
  }
}
