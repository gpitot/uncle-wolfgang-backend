import express from "express";
import {
  getUsers,
  addUserEvent,
  updateUserEvent,
} from "../../../queries/user_events";
import {authenticateAdmin} from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get(
  "/:event_id",
  (req, res, next) => validateRequest(["event_id"], req.params, res, next),
  async (req, res) => {
    getUsers(req.params)
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
  authenticateAdmin,
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
  (req, res, next) =>
    validateRequest(["firstname", "lastname", "event_id"], req.body, res, next),
  async (req, res) => {
    console.log(req.body);
    addUserEvent(req.body)
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
          err,
        });
      });
  }
);

export default router;
