
import express from 'express';
import vw from './projects/6825_vw';

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('this is the api home')
});

router.use('/vw', vw);

export default router;
