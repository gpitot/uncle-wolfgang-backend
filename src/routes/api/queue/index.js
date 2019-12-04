//get queue for current auth'd user

import express from 'express';

import auth from '../../../middleware/auth';
import { User } from '../../../models/user.model';
import { Match } from '../../../models/match.model';

const router = express.Router();

/*
get users that
- are in current location range
- are in current age range
- are correct gender
- have not been approved/denied by current user (for now just do this step)

limit by X

*/
router.get('/', auth, async (req, res) => {
  const id = req.user._id;
  console.log(id);
  const allUsers = await User.find(
    {
      _id: { $ne: id }
    },
    'email'
  )
    .lean()
    .limit(20);

  const matchedUsers = await Match.find({
    userA: id
  }).lean();

  res.send({
    allUsers,
    matchedUsers
  });
});

export default router;
