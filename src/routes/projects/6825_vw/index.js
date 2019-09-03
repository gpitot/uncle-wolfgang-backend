
import express from 'express';

var router = express.Router();



//check code word given against code word of day
const codes = [
    {
        date : 'September 03 2019',
        code : 'TEST'
    },
    {
        date : 'September 04 2019',
        code : 'TEST'
    },
    {
        date : 'September 05 2019',
        code : 'TEST'
    },
    {
        date : 'September 08 2019',
        code : 'ALL STARS'
    },
    {
        date : 'September 09 2019',
        code : 'ENSUITE'
    },
    {
        date : 'September 10 2019',
        code : 'TERRACE'
    },
    {
        date : 'September 11 2019',
        code : 'CHALLENGE'
    },
    {
        date : 'September 12 2019',
        code : 'TOOLS DOWN'
    }
]

/* GET home page. */
router.post('/', function(req, res, next) {
    const userCode = req.body.code;
    if (!userCode) {
        res.status(200);
        res.json({success:false});
    } 

    const currentDate = new Date();

    for (let i=0; i<codes.length; i+=1) {
        const {date, code} = codes[i];
        const dateCheck = new Date(date);
        if (
            currentDate.getDate() ===  dateCheck.getDate()
            &&
            currentDate.getMonth() ===  dateCheck.getMonth()
            &&
            currentDate.getYear() ===  dateCheck.getYear()
        ) {
            if (code.toLowerCase() === userCode.toLowerCase()) {
                res.status(200);
                return res.json({success: true});
            } else {
                res.status(200);
                return res.json({success: false});
            }
        }
    }

    res.status(200);
    return res.json({success: false});
    

});


export default router;
