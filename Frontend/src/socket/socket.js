import { io } from "socket.io-client";

const socket = io("https://api-rate-limiter-1xhr.onrender.com", {
  transports: ["websocket"],
});

export const subscribeAnalyticsEvents = (handlers) => {
  if (handlers.analyticsUpdate) {
    socket.on("analytics-update", handlers.analyticsUpdate);
  }
  if (handlers.blockedRequest) {
    socket.on("blocked-request", handlers.blockedRequest);
  }
  if (handlers.algorithmChanged) {
    socket.on("algorithm-changed", handlers.algorithmChanged);
  }
};

export const emitSubscribeAnalytics = () => {
  socket.emit("subscribe-analytics");
};

export default socket;
