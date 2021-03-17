import express from "express";
import cookieParser from "cookie-parser";
import config from "config";
import cors from "cors";
import http from "http";
import expressSession from "express-session";
import apiRouter from "./routes-api";
// eslint-disable-next-line import/no-commonjs
require("dotenv").config();

const { SESSION_SECRET } = process.env;

const app = express();

const server = http.createServer(app);

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

app.use(cookieParser());

app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    credentials: true,
    origin: [
      "https://northmanlysquash.com",
      "http://localhost:3001",
      "https://northmanlysquash-v2.netlify.app",
      "https://6030ad0f4b6bfa0007e7ed01--northmanlysquash-v2.netlify.app",
    ],
  })
);

app.use("/api", apiRouter);

export { server };
export default app;
