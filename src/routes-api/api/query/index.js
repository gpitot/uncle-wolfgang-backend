import express from "express";
import { query } from "../../../queries/query";
const router = express.Router();

router.get("/", async (req, res) => {
  // const hr = 1000 * 60 * 60;
  // const d = hr * 24;
  // const s1 = 1636354800000; //6pm
  // const s2 = s1 + hr; //7pm
  // const s3 = s2 + hr * 1.5; //830pm
  // const o = s1 - (d * 5) - (hr * 12);
  // const week = d * 7;
  //
  // let sql = `insert into events (name, description, spots, start, open) values`;
  // const maximum = 100;
  // for (let i=0; i<maximum; i+=1) {
  //   const offset = week * i;
  //   sql += `
  //     ('Monday session 1', 'Monday Social from 6 to 7pm. $12.50 intended for beginner - intermediate.', 4, ${s1 + offset}, ${o + offset}),
  //     ('Monday session 2', 'Monday Social from 7 to 830pm. $17.50 intended for beginner - intermediate.', 8, ${s2 + offset}, ${o + offset}),
  //     ('Monday session 3', 'Monday Social from 830 to 10pm. $17.50 intended for intermediate - advanced.', 8, ${s3 + offset}, ${o + offset})
  //   `;
  //   if (i < maximum - 1) {
  //     sql += ','
  //   }
  // }

  const q = `
    select * from ladder_ranks order by rank desc
    `;

  //114
  //113
  //105

  //select * from ladder_matches where player_1 = 16 and player_2 = 22 and approved = false
  //2020-12-19T08:16:04.714Z"
  query(q)
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
