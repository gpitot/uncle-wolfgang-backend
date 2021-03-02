import express from "express";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

import {
  getShop,
  addTransaction,
  getTransactions,
} from "../../../queries/shop";
import { authenticateUser, authenticateAdmin } from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get(
  "/",
  (req, res, next) => validateRequest(["category"], req.query, res, next),
  async (req, res) => {
    getShop({ ...req.query })
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
  (req, res, next) => validateRequest(["itemId"], req.body, res, next),
  authenticateUser,
  async (req, res) => {
    addTransaction({
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

router.post("/payment", authenticateUser, async (req, res) => {
  const { amount, nonce } = req.body;

  const data = {
    source_id: nonce,
    idempotency_key: uuidv4(),
    amount_money: {
      amount: amount,
      currency: "AUD",
    },
  };

  console.log(data);

  fetch("https://connect.squareupsandbox.com/v2/payments", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer EAAAEPP6ynlEVJIigMMHMrLnoEhYWl1-sIIMqoEmDDl3rkkb9AWkeDKpmQA6lSqG",
      Accept: "application/json",
      "Square-Version": "2021-02-26",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      res.send({ success: true, result });
    })
    .catch((err) => {
      console.log(err);
      res.send({ success: false });
    });
});

export default router;
