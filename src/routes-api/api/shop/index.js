import express from "express";
import { getShop, getTransactions } from "../../../queries/shop";
import { authenticateUser, authenticateAdmin } from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get("/", async (req, res) => {
  getShop()
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

router.get("/transactions", authenticateAdmin, async (req, res) => {
  getTransactions()
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
  "/transactions",
  (req, res, next) => validateRequest(["item_id"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    getTransactions({
      ...req.body,
      userId: req.user.id,
    })
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
