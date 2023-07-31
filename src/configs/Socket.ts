import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";

export class SocketIOConfigurator {
  private socketIo: SocketIOServer;

  constructor(server: Server) {
    this.socketIo = new SocketIOServer(server, { cors: { origin: "*" } });
  }

  public configureSocket() {
    this.socketIo.on("connection", (socket) => {
      socket.on("join", (channel) => {
        console.log(`User joined channel: ${channel}`);
        socket.join(channel);
      });

      socket.on("message", (data) => {
        const { channel, id, content } = data;
        this.socketIo.to(channel).emit("message", {
          _id: "temp-id",
          sender: id,
          text: content,
        });
      });

      socket.on("disconnect", () => {
        socket.disconnect();
      });
    });
  }
}
