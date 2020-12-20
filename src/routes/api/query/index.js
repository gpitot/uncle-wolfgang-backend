import express from "express";
import { query } from "../../../queries/query";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = `
  SELECT 
  events.spots, events.start, events.open, events.enabled, user_events.firstname
   from events left join user_events on events.id = user_events.event_id
   where events.id = 1 and events.start > now() and events.open < now() and user_events.enabled = true;
  ;
    `;

  //2020-12-19T08:16:04.714Z"
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
