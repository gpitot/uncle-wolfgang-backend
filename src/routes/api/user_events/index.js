import express from 'express';
import { getUsers, addUserEvent } from '../../../queries/user_events';
import auth from '../../../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  getUsers({ event_id: 1, event_date: '10/12/2020' })
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

router.post('/', auth, async (req, res) => {
  addUserEvent(req.body)
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
