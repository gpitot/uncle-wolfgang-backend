import express from 'express';
import { events } from '../../../queries/events';

const router = express.Router();

router.get('/', async (req, res) => {
  events()
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
