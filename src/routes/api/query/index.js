import express from "express";
import { query } from "../../../queries/query";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = `
select * from user_events where event_date > '2020-12-10'::date;
    `;
  query(q)
    .then((result) => {
      res.send({
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: err,
      });
    });
});

export default router;
