import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
const jwtSecret = process.env.SECRET_TOKEN as string;

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM users";
      const result = await client.query(sql);
      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrieve users: ${error}`);
    } finally {
      client.release();
    }
  }

  async showUserInfo(userId: number): Promise<{ data: User; token: string }> {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM users WHERE id = $1";
      const result = await client.query(sql, [userId]);

      if (result.rows.length) {
        const user = result.rows[0];
        const token = jwt.sign(
          { userName: user.user_name, id: user.id },
          jwtSecret
        );
        return { data: user, token };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error(`Could not retrieve user: ${error}`);
    } finally {
      client.release();
    }
  }

  async createUser(user: User): Promise<{ data: User; token: string }> {
    const client = await pool.connect();
    try {
      const checkExistenceSQL =
        "SELECT EXISTS (SELECT 1 FROM users WHERE user_name = $1)";
      const result = await client.query(checkExistenceSQL, [user.userName]);

      if (result.rows[0].exists) {
        throw new Error("Username already exists");
      }

      const hash = bcrypt.hashSync(user.password + pepper, saltRounds);
      const insertSQL =
        "INSERT INTO users (first_name, last_name, user_name, password) VALUES ($1, $2, $3, $4) RETURNING *";
      const insertResult = await client.query(insertSQL, [
        user.firstName,
        user.lastName,
        user.userName,
        hash,
      ]);

      const newUser = insertResult.rows[0];
      const token = jwt.sign(
        { userName: newUser.user_name, id: newUser.id },
        jwtSecret
      );

      return { data: newUser, token };
    } catch (error) {
      throw new Error(`Could not create user: ${error}`);
    } finally {
      client.release();
    }
  }

  async authenticate(
    userName: string,
    password: string
  ): Promise<string | null> {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM users WHERE user_name = $1";
      const result = await client.query(sql, [userName]);

      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return jwt.sign({ userName: user.user_name, id: user.id }, jwtSecret);
        } else {
          throw new Error("Invalid username or password");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error(`Could not authenticate user: ${error}`);
    } finally {
      client.release();
    }
  }
}
