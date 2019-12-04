import express from 'express';
import create from './create';
import match from './match';

const router = express.Router();

//create a user
router.use('/create', create);
router.use('/match', match);

export default router;
