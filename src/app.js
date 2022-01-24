import express from "express";
import cookieParser from "cookie-parser";
import config from "config";
import cors from "cors";
import http from "http";
import expressSession from "express-session";
import { Server } from "socket.io";
// eslint-disable-next-line import/no-commonjs
require("dotenv").config();

import { registerSetup } from "./sockets";

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
    origin: ["http://localhost:3001"],
  })
);

const io = new Server(server, {
  /* options */
});
// https://socket.io/docs/v3/server-application-structure/
io.on("connection", (socket) => {
  registerSetup(io, socket);
});

export { server };
export default app;
