import express from "express";
import { addEvent, getEvents, editEvent } from "../../../queries/events";
import auth from "../../../middleware/auth";
import { validateRequest } from "../../../middleware/validation";

const router = express.Router();

router.get("/", async (req, res) => {
  getEvents()
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
});

router.put(
  "/",
  auth,
  (req, res, next) =>
    validateRequest(
      ["id", "name", "description", "spots", "start", "open", "enabled"],
      req.body,
      res,
      next
    ),
  async (req, res) => {
    editEvent(req.body)
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
    validateRequest(
      ["name", "description", "spots", "start", "open"],
      req.body,
      res,
      next
    ),
  async (req, res) => {
    addEvent(req.body)
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
