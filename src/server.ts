import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Request, Response } from "express";
import routers from "./routes";

dotenv.config();

const app: express.Application = express();
const port = 3000;
const host = "localhost";

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to our API!");
});

app.use("/api", routers);

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

export default app;
