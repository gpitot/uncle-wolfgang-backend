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
 values ('101573359282867079048', 1, 8750)
 */
  //   const t = `
  //   insert into ladders (name, description) values ('North Manly Youth League', 'The best young players in the region.')
  //     `;
  //   //unique_player_ladder_ranks
  //   const s = `ALTER TABLE ladder_ranks
  //   DROP CONSTRAINT unique_player_ladder_ranks;
  //   `;

  //   let a = `
  //     insert into events (name, description, spots, start, open) values
  //     ('Monday coaching', 'Monday Coaching. $10 for an hour with world class coaches', 8, '2021-03-01 19:00:00', '2021-02-27 12:00:00'),
  //     ('Monday session 1', 'Monday Social from 7 to 830pm. $17.50 available to all skill levels.', 9, '2021-03-01 19:00:00', '2021-02-27 12:00:00'),
  //     ('Monday session 2', 'Monday Social from 830 to 10pm. $17.50 available to all skill levels.', 9, '2021-03-01 19:00:00', '2021-02-27 12:00:00')
  //   `;

  // let initialStart = new Date("2021-03-01 19:00:00");
  // let initialOpen = new Date("2021-02-27 12:00:00");

  // const format = (d) => {
  //   return `${d.getFullYear()}-`
  // }

  // for (let i = 0; i < 50; i += 1) {
  //   a += ` ('Monday session 1', 'Monday Social from 7 to 830pm. $17.50 available to all skill levels.', 9, '${initialStart}', '${initialOpen}' )`;
  //   initialStart.setDate(initialStart.getDate() + 7);
  //   initialOpen.setDate(initialOpen.getDate() + 7);
  // }
  // console.log(a);

  const b = `
  select * from events;
  `;

  //2020-12-19T08:16:04.714Z"
  query(b)
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
