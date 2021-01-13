import express from "express";
import {
  addEvent,
  getEvent,
  getEvents,
  editEvent,
} from "../../../queries/events";
import {  authenticateAdmin } from "../../../middleware/auth";
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

router.get(
  "/:id",
  (req, res, next) => validateRequest(["id"], req.params, res, next),
  async (req, res) => {
    getEvent(req.params)
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
    validateRequest(
      ["id", "name", "description", "spots", "start", "open", "enabled"],
      req.body,
      res,
      next
    ),
  authenticateAdmin,
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

  (req, res, next) =>
    validateRequest(
      ["name", "description", "spots", "start", "open"],
      req.body,
      res,
      next
    ),
  authenticateAdmin,
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
