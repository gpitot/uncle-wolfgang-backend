import express from "express";
import { addEvent, getEvents } from "../../../queries/events";
import auth from "../../../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  getEvents()
    .then((result) => {
      res.send({
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: "fail",
      });
    });
});

router.post("/", auth, async (req, res) => {
  addEvent(req.body)
    .then((result) => {
      res.send({
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: "fail",
      });
    });
});

export default router;
