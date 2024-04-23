import express, { Router, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();
import Config from "./config";
import routerNavigation from "./navigation/routes";

const app = express();

app.use(cors());

app.use(express.json({ limit: "70mb" }));

const route = Router();

export const AppDataSource = new DataSource({...Config().DATASOURCE});

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "Seja bem vindo nossa aplicação ( ͡~ ͜ʖ ͡°) " });
});

app.use(route);

app.use(routerNavigation)

AppDataSource.initialize()
  .then(() => {
    console.log("Sucess");
  })
  .catch((error) => console.log(error));

app.listen(Config().PORT, function () {
  console.log(`Listening on http://localhost:${Config().PORT} `);
});

