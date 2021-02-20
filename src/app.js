import express from "express";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import logger from "morgan";
import config from "config";
import cors from "cors";
import http from "http";
import expressSession from "express-session";
import apiRouter from "./routes-api";
import authRouter from "./routes-auth";

require("dotenv").config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env;

const app = express();

const server = http.createServer(app);

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

passport.use(
  new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/callback/google",
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

app.use(cookieParser());

const setCookiePassport = (req, res, next) => {
  if (req.headers.authcookie) {
    req.cookies["connect.sid"] = req.headers.authcookie;
    //req.headers.cookie = req.headers.authcookie.replace(":", "%3A");
  }

  next();
};

app.use(setCookiePassport);

app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3001",
      "https://northmanlysquash-v2.netlify.app",
      "https://6030ad0f4b6bfa0007e7ed01--northmanlysquash-v2.netlify.app",
    ],
  })
);

app.use("/api", apiRouter);
app.use("/auth", authRouter);

export { server };
export default app;
