import express from 'express';
import { query } from '../../../queries/query';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = `
  INSERT INTO events (event_name, event_description, event_people_limit, event_day)
   VALUES ('Monday Social Squash Session 2', 'Monday Night Social Squash Session 2', 9, 'monday');
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
        result: 'fail',
      });
    });
});

export default router;
