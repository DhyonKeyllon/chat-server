import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { message, user } from "../routes";

import swaggerJSONDocs from "../swagger.json";

export class ExpressServer {
  public app: Application;

  constructor() {
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(cors());

    this.app.use("/users", user);
    this.app.use("/messages", message);
    this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSONDocs));
  }

  public getApp(): Application {
    return this.app;
  }
}
