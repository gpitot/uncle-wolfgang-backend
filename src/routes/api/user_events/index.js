import express from "express";
import {
  getUsers,
  addUserEvent,
  updateUserEvent,
} from "../../../queries/user_events";
import auth from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get(
  "/",
  (req, res, next) => validateRequest(["event_id"], req.query, res, next),
  async (req, res) => {
    getUsers(req.query)
      .then((result) => {
        res.send({
          success: true,
          result,
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

router.put(
  "/",
  auth,
  (req, res, next) =>
    validateRequest(["id", "event_id", "paid", "enabled"], req.body, res, next),
  async (req, res) => {
    updateUserEvent(req.body)
      .then((result) => {
        res.send({
          success: true,
          result,
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

router.post(
  "/",
  auth,
  (req, res, next) =>
    validateRequest(["firstname", "event_id"], req.body, res, next),
  async (req, res) => {
    addUserEvent(req.body)
      .then((result) => {
        res.send({
          success: true,
          result,
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          err
        });
      });
  }
);

export default router;
