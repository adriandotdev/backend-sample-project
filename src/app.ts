import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import { morganLogger } from "./middleware/morgan";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: "https://myappstore.com" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(morganLogger);

const APPNAME = process.env.APP_NAME;

app.get("/", (_req, res) => {
	res.json({ appName: APPNAME, message: "Success" });
});

app.use("/products", productRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
