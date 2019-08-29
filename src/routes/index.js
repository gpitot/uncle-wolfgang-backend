
import express from 'express';
import vw from './projects/6825_vw';
import instagram from './projects/instagram-source';

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(`
    <h3>list of routes</h3>

    <ul>
    <li>/vw</li>
    <li>/instagram</li>
    </ul>
  `)
});

router.use('/vw', vw);
router.use('/instagram', instagram);



export default router;
