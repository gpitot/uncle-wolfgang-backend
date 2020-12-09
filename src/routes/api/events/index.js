import express from 'express';
import eventList from './event_list';
import userEvents from './users';

const router = express.Router();

router.use('/event_list', eventList);
router.use('/user_events', userEvents);

export default router;
