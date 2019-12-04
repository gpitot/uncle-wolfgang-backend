import bcrypt from 'bcrypt';
import { User, validate } from '../../../models/user.model';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');
  
  user = new User({
    dob: req.body.dob,
    email: req.body.email,
    password : req.body.password
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});



router.get('/', async (req, res) => {
    const users = await User.find();
    console.log(users);
    res.status(200);
    res.send(users);
});

export default router;
