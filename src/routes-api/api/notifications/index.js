import express from "express";
import { authenticateUser } from "../../../middleware/auth";
import {
  getNotifications,
  acknowledgeNotification,
} from "../../../queries/notifications";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  getNotifications(req.user.id)
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
});

router.post(
  "/",
  (req, res, next) => validateRequest(["id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    acknowledgeNotification(req.body)
      .then(() => {
        res.send({
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

export default router;
