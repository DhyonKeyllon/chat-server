import { Error } from "mongoose";
import { Request, Response } from "express";

import { App } from "./App";

const server = new App();

server.app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

server.start();
