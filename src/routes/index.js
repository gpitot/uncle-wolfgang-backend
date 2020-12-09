import express from 'express';
import ladder from './api/ladder';
import events from './api/events';
import query from './api/query';
const router = express.Router();

router.use('/ladder', ladder);
router.use('/events', events);
router.use('/query', query);

export default router;
