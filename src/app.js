import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import AWS from 'aws-sdk';
import cors from 'cors';

import indexRouter from './routes/index';

AWS.config.region = process.env.REGION;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '../public')));
app.options(/\.nine\.com\.au$/, cors())

app.get('/', (req, res) => {
    res.send('powered api');
})

app.use('/api', indexRouter);

export default app;
