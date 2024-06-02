import client from "../connection";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};
export class ProductStore {
  // @ts-ignore
  async getAllProducts(): Promise<Product[]> {
    try {
      const connection = await client!.connect();
      const sql = `SELECT * FROM products`;
      const result = await connection.query(sql);
      if (result && result.rows) {
        connection.release();
        return result.rows;
      } else {
        connection.release();
        throw new Error(`Data Not Found`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  // @ts-ignore
  async getProductById(product_id): Promise<Product> {
    try {
      const connection = await client!.connect();
      const sql = `SELECT * FROM products WHERE id = ${product_id}`;
      const result = await connection.query(sql);
      if (result.rows && result.rows.length > 0) {
        connection.release();
        return result.rows[0];
      } else {
        connection.release();
        throw new Error(`Data Not Found`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  // @ts-ignore
  async createNewProduct(p: Product): Promise<Product> {
    try {
      const newProduct: Product = {
        name: p.name,
        price: p.price,
        category: p.category,
      };
      const connection = await client!.connect();
      const sql =
        "INSERT INTO products (name, price , category) VALUES ($1,$2,$3) RETURNING *";
      const result = await connection.query(sql, [
        newProduct.name,
        newProduct.price,
        newProduct.category,
      ]);
      if (result && result.rows.length > 0) {
        const createdProduct = result.rows[0];
        connection.release();
        return createdProduct;
      } else {
        connection.release();
        throw new Error(`Error when insert data to db`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const connection = await client!.connect();
      const sql = `SELECT * FROM products WHERE category LIKE '%${category}%'`;
      const result = await connection.query(sql);
      if (result && result.rows.length > 0) {
        const productByCategory = result.rows;
        return productByCategory;
      } else {
        connection.release();
        throw new Error(`Data Not Found`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
