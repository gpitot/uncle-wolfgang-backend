
import express from 'express';
import usersRoute from './api/user';
import queueRoute from './api/queue';

const router = express.Router();


router.use('/users', usersRoute);
router.use('/queue', queueRoute);

export default router;
