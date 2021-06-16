import express from "express";
import {
  reminderNotification,
  getSMSSentNotifications,
} from "../../../queries/notifications";
import {
  authenticateAdmin,
  authenticateSuperman,
} from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.post(
  "/",
  (req, res, next) =>
    validateRequest(
      ["reminderType", "player_1", "player_2"],
      req.body,
      res,
      next
    ),
  authenticateSuperman,
  async (req, res) => {
    reminderNotification(req.body)
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

router.get("/", authenticateAdmin, (req, res) => {
  getSMSSentNotifications()
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

export default router;
