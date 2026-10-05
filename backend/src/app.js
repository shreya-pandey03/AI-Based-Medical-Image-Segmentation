import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import scanRoutes from "./routes/medicalScan.routes.js";
import reportRoutes from "./routes/report.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/scans", scanRoutes);
app.use("/api/v1/report", reportRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

export { app };