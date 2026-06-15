import exp from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { authApp } from "./APIs/AuthAPI.js";
import { userApp } from "./APIs/UserAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { analyticsApp } from "./APIs/AnalyticsAPI.js";
import { dataApp } from "./APIs/DataAPI.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = exp();

app.use(exp.json());
app.use(
  cors({
    origin: "https://api-rate-limiter-1-07yk.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(morgan("combined"));

app.use("/api/auth", authApp);
app.use("/api/user", userApp);
app.use("/api/admin", adminApp);
app.use("/api/analytics", analyticsApp);
app.use("/api/data", dataApp);

app.use(errorMiddleware);

export default app;
