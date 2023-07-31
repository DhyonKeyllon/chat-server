import { Application } from "express";
import { createServer, Server } from "http";

import SocketIOConfigurator from "./configs/Socket";
import { MongoDBConnector } from "./configs/Mongoose";
import { ExpressServer } from "./configs/Express";

interface SocketService {
  configureSocket(): void;
}

interface MongoDBService {
  connect(): void;
}

class App {
  public PORT: string;
  public app: Application;
  private server: Server;
  private socketService: SocketService;
  private mongoDBService: MongoDBService;

  constructor() {
    this.PORT = process.env.PORT || "";
    const expressServer = new ExpressServer();
    this.app = expressServer.getApp();

    this.server = createServer(this.app);

    this.socketService = new SocketIOConfigurator(this.server);
    this.socketService.configureSocket();

    this.mongoDBService = new MongoDBConnector();
    this.mongoDBService.connect();
  }

  public start() {
    this.server.listen(this.PORT, () => {
      console.log(`Server listening on port ${this.PORT}`);
    });
  }
}

export default App;
