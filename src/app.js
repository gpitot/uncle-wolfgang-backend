import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import config from 'config';
import cors from 'cors';

import router from './routes';

const app = express();

//use config module to get the privatekey, if no private key set, end the application
if (!config.get('myprivatekey')) {
  console.error('FATAL ERROR: myprivatekey is not defined.'); 
  process.exit(1);
}

//connect to mongodb
mongoose
  .connect('mongodb://localhost/nodejsauth', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.options(/\.nine\.com\.au$/, cors())
app.use(cors());

app.use('/api', router);

export default app;
