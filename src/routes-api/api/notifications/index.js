import express from "express";
import { reminderNotification } from "../../../queries/notifications";
import { authenticateSuperman } from "../../../middleware/auth";
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

export default router;
