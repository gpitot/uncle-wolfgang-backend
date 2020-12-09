import express from 'express';
import { getEvents } from '../../../queries/events';

const router = express.Router();

router.get('/', async (req, res) => {
  getEvents()
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
