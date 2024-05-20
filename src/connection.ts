import dotenv from "dotenv";
import { Pool } from "pg";

// Load environment variables from .env file
dotenv.config();

// Destructure environment variables
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
  POSTGRES_DB_TEST,
} = process.env;

// Declare a variable to hold the PostgreSQL client and assign it to undefined initially
let client: Pool | undefined;

// Configure the client based on the environment
if (ENV === "test") {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  console.log("Connected to the Test Database");
} else if (ENV === "dev") {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  console.log("Connected to the Development Database");
} else {
  throw new Error(`Unknown environment: ${ENV}`);
}

// Ensure the client is assigned
if (!client) {
  throw new Error("Database client is not initialized");
}

// Export the configured client for use in other parts of the application
export default client;
