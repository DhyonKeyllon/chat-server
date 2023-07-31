import mongoose from "mongoose";

export class MongoDBConnector {
  public async connect(): Promise<void> {
    return mongoose
      .connect(process.env.MONGODB_URI || "")
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  }
}
