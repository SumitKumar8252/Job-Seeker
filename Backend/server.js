import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./configs/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

const PORT = process.env.PORT || 3000;

app.use("/job-app/", authRoutes);

app.use("/job-app/auth", authRoutes);
app.use("/job-app/jobs", jobRoutes);



connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT} ✨`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed ❌", err);
  });
