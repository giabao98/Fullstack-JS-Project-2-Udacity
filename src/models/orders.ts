import client from "../connection";

export type Order = {
  id?: number;
  product_id: number;
  user_id: number;
  quantity: number;
  status: string;
};

export class OrderStore {
  // @ts-ignore
  async getAllOrders(): Promise<Order[]> {
    try {
      const connection = await client!.connect();
      const sql = `SELECT * FROM orders`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Data Not Found`);
    }
  }
  // create order
  async createOrder(order: Order): Promise<Order> {
    try {
      const newOrder: Order = {
        product_id: order.product_id,
        quantity: order.quantity,
        user_id: order.user_id,
        status: order.status,
      };
      const connection = await client!.connect();
      const sql_insert_order = `
          WITH new_row AS (
              INSERT INTO orders (product_id,quantity, user_id,status)
              VALUES ($1,$2,$3,$4) RETURNING *
            )
          INSERT INTO order_product (order_id, product_id) VALUES ((SELECT id FROM new_row), (SELECT product_id FROM new_row)) RETURNING *;
          `;
      const result = await client!.query(sql_insert_order, [
        newOrder.product_id,
        newOrder.quantity,
        newOrder.user_id,
        newOrder.status,
      ]);
      if (result && result.rows.length > 0) {
        const createdOrder = result.rows[0];
        connection.release();
        return createdOrder;
      } else {
        connection.release();
        throw new Error(`Error when insert data to db`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // get order by user_id
  async getOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const connection = await client!.connect();
      const sql = `SELECT orders.id , orders.product_id , orders.user_id , orders.quantity, orders.status
        FROM orders
        INNER JOIN users
            ON orders.user_id = users.id
        WHERE users.id = ${userId}
        `;
      const results = await client!.query(sql);
      if (results) {
        const ordersOfUser = results.rows;
        connection.release();
        return ordersOfUser;
      } else {
        connection.release();
        throw new Error(`Data not found`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  // get completed order by user_id
  async getCompletedOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const connection = await client!.connect();
      const sql = `SELECT orders.id , orders.product_id , orders.user_id , orders.quantity, orders.status
          FROM orders
          INNER JOIN users
              ON orders.user_id = users.id
          WHERE users.id = ${userId}
          AND orders.status = 'complete'
          `;
      const results = await client!.query(sql);
      if (results) {
        const ordersOfUser = results.rows;
        connection.release();
        return ordersOfUser;
      } else {
        connection.release();
        throw new Error(`Data not found`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async updateOrderStatusToComplete(orderId: number): Promise<Order> {
    try {
      const connection = await client!.connect();
      const sql = `
            UPDATE orders
            SET status = 'complete'
            WHERE id = ${orderId}
            RETURNING *;
        `;
      const result = await connection.query(sql);
      if (result) {
        const updatedOrder = result.rows[0];
        connection.release();
        return updatedOrder;
      } else {
        connection.release();
        throw new Error(`Error when updating order status`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
