import express from "express";
import jwt from "jsonwebtoken";
import {
  login,
  addUser,
  getUser,
  resetPassword,
  generateResetToken,
  searchForUsers,
} from "../../../queries/users";
import { validateRequest } from "../../../middleware/validation";
import { authenticateUser, authenticateAdmin } from "../../../middleware/auth";

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

router.get("/user/:id", authenticateUser, async (req, res) => {
  getUser(req.params.id)
    .then((data) => {
      res.send({
        success: true,
        user: data,
      });
    })
    .catch((err) => {
      res.send({ success: false, err });
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
      ["email", "password", "firstname", "lastname", "phone"],
      req.body,
      res,
      next
    ),
  async (req, res) => {
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
      .catch(() => {
        res.send({
          success: false,
        });
      });
  }
);

router.post(
  "/reset",
  (req, res, next) =>
    validateRequest(["token", "password"], req.body, res, next),
  async (req, res) => {
    resetPassword(req.body)
      .then(() => {
        res.json({
          success: true,
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
  "/generate-reset",
  (req, res, next) => validateRequest(["user_id"], req.body, res, next),
  authenticateAdmin,
  async (req, res) => {
    generateResetToken(req.body)
      .then((token) => {
        res.json({
          success: true,
          result: {
            token,
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

router.get(
  "/search",
  (req, res, next) => validateRequest(["q"], req.query, res, next),
  authenticateAdmin,
  async (req, res) => {
    if (req.query.q.length < 1) {
      return res.send({
        success: true,
        result : []
      });
    }
    searchForUsers(req.query)
      .then((data) => {
        res.send({
          success: true,
          result: data,
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
