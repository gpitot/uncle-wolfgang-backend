import express from 'express';
import auth from '../../../middleware/auth';
import { Match, validate } from '../../../models/match.model';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const data = {
    userA: req.user._id,
    userB: req.body.userB,
    approved: req.body.approved
  };
  console.log(data);
  const { error } = validate(data);
  if (error) return res.status(400).send(error.details[0].message);

  const match = new Match(data);
  await match.save();

  res.status(200).send({ success: true });
});


router.get('/', async (req, res) => {
    const matches = await Match.find();
   
    res.status(200);
    res.send(matches);
});

export default router;
