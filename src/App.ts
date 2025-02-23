import { Application } from "express";
import { createServer, Server } from "http";

import { SocketIOConfigurator } from "./configs/Socket";
import { MongoDBConnector } from "./configs/Mongoose";
import { ExpressServer } from "./configs/Express";

interface SocketService {
  configureSocket(): void;
}

interface DatabaseService {
  connect(): void;
}

class App {
  public PORT: string;
  public app: Application;
  private server: Server;
  private socketService: SocketService;
  private databaseService: DatabaseService;

  constructor() {
    this.PORT = process.env.PORT || "";
    const expressServer = new ExpressServer();
    this.app = expressServer.getApp();

    this.server = createServer(this.app);

    this.socketService = new SocketIOConfigurator(this.server);
    this.socketService.configureSocket();

    this.databaseService = new MongoDBConnector();
    this.databaseService.connect();
  }

  public start() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT is not defined");
    }

    this.server.listen(this.PORT, () => {
      console.log(`Server listening on port ${this.PORT}`);
    });
  }
}

export { App };
