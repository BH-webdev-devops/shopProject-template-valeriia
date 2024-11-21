import express, { Application } from "express";
import { AppDataSource } from "./data/dataSource";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import productRouter from "./routes/productRouter";
import orderRouter from "./routes/orderRouter";
import cors from "cors";
import "dotenv/config";
import "reflect-metadata";

const app: Application = express();
const port = process.env.PORT || 8080;

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://frontend-do3zautv5-lyaleras-projects.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // If cookies or credentials are required
  })
);

AppDataSource.initialize()
  .then(() => {
    app.use("/api", authRouter, userRouter, productRouter, orderRouter);
    app.listen(port, () =>
      console.log(`Welcome to our server running on port ${port} 🟢`)
    );
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });
