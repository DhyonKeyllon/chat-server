import { Error } from "mongoose";
import App from "./app";
import { Request, Response } from "express";

const app = new App();

app.app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.app.listen(app.PORT, () => console.log(`Server is running on port ${app.PORT}`));
