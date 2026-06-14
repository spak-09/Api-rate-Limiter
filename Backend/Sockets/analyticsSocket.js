import { Server } from "socket.io";

export const initAnalyticsSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    socket.on("subscribe-analytics", () => {
      socket.join("analytics");
    });
  });

  return io;
};
