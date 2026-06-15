import { Server } from "socket.io";

export const initAnalyticsSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "https://api-rate-limiter-1-07yk.onrender.com",
      credentials: true,
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
