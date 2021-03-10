import express from "express";
import jwt from "jsonwebtoken";
import { login, addUser } from "../../../queries/users";
import { validateRequest } from "../../../middleware/validation";
import { authenticateUser } from "../../../middleware/auth";

// eslint-disable-next-line import/no-commonjs
require("dotenv").config();
const { SESSION_SECRET } = process.env;

const router = express.Router();

router.get("/me", authenticateUser, async (req, res) => {
  res.send({
    success: true,
    user: req.user,
  });
});

router.post(
  "/login",
  (req, res, next) =>
    validateRequest(["email", "password"], req.body, res, next),
  async (req, res) => {
    login(req.body)
      .then((data) => {
        const accessToken = jwt.sign(data, SESSION_SECRET);

        res.json({
          success: true,
          user: {
            ...data,
            accessToken,
          },
        });
      })
      .catch(() => {
        res.send({
          success: false,
        });
      });
  }
);

router.post(
  "/create",
  (req, res, next) =>
    validateRequest(
      ["email", "password", "firstname", "lastname"],
      req.body,
      res,
      next
    ),
  async (req, res) => {
    console.log(SESSION_SECRET);
    addUser(req.body)
      .then((data) => {
        const accessToken = jwt.sign(data, SESSION_SECRET);

        res.json({
          success: true,
          user: {
            ...data,
            accessToken,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          success: false,
        });
      });
  }
);

export default router;
