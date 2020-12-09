import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import config from 'config';
import cors from 'cors';
import http from 'http';
import router from './routes';

const app = express();

const server = http.createServer(app);

//use config module to get the privatekey, if no private key set, end the application
if (!config.get('myprivatekey')) {
  console.error('FATAL ERROR: myprivatekey is not defined.');
  process.exit(1);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/api', router);

export { server };
export default app;
