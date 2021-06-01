import express from "express";
import {
  getUsers,
  addUserEvent,
  updateUserEvent,
  removeSelfUserEvent,
  getUsersPastEvents,
} from "../../../queries/user_events";
import { authenticateAdmin, authenticateUser } from "../../../middleware/auth";
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
  (req, res, next) =>
    validateRequest(["id", "event_id", "paid", "enabled"], req.body, res, next),
  authenticateAdmin,
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

router.put(
  "/remove",
  (req, res, next) => validateRequest(["id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    removeSelfUserEvent({ ...req.body, user: req.user })
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
  (req, res, next) => validateRequest(["event_id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    addUserEvent({
      user_id: req.user.id,
      event_id: req.body.event_id,
    })
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

router.post(
  "/manual-entry",
  (req, res, next) => validateRequest(["event_id"], req.body, res, next),
  authenticateAdmin,
  async (req, res) => {
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

router.get(
  "/user-history/:user_id",
  (req, res, next) => validateRequest(["user_id"], req.params, res, next),
  authenticateUser,
  async (req, res) => {
    const userId = req.params.user_id;
    getUsersPastEvents(userId)
      .then((result) => {
        res.send({
          success: true,
          result,
        });
      })
      .catch(() => {
        res.send({
          success: false,
        });
      });
  }
);

export default router;
