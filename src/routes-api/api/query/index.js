import express from "express";
import { query } from "../../../queries/query";

const router = express.Router();

router.get("/", async (req, res) => {
  //+ 11 hours
  // const q = `
  // SELECT *, current_timestamp FROM events
  // where start >= now() + '11 hour'::interval
  // ;
  //   `;

  // const qq = `SELECT
  //   events.spots, events.start, events.open, events.enabled, user_events.firstname
  //    from events left join user_events on events.id = user_events.event_id
  //    where events.id = 1 and events.start >= now() + '11 hour'::interval and events.open <= now() + '11 hour'::interval
  //    and events.enabled = true
  //    and user_events.enabled = true;`;

  // const qu = `update events
  //   set start = '2021-01-05 19:00:00',
  //   open = '2021-01-05 10:14:00'
  //   where id = 1;
  //   `;

  // const q2 = `select events.enabled as event_enabled, user_events.enabled as user_event_enabled from events
  //   left join user_events on events.id = user_events.event_id where events.id = 1
  //   and events.start >= now() + '11 hour'::interval and events.open <= now() + '11 hour'::interval
  //   and events.enabled = true
  //   ;
  //   `;

  /*

    insert into ladder_ranks
 (player_id, ladder_id, rank)
 values ('106578756968220466564', 1, 5000)

 */
  const t = `
  select * from events;

  ;
    `;

  //2020-12-19T08:16:04.714Z"
  query(t)
    .then((result) => {
      res.send({
        result: result.rows,
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
