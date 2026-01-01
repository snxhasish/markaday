import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
    config();
}

import connectMongoDB from "./db/connect";
import routes from "./routes";

const app = express();
connectMongoDB();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/", routes);

app.use((req, res) => {
    // console.log(res);
    res.status(404).json({ message: "Not Found" });
});

export default app;