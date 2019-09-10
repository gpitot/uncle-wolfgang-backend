
import express from 'express';

var router = express.Router();

const dayMSeconds = 86400000; //miliseconds in a day
const startTime = 1567933140000; //6.59 pm sunday 8th
//check code word given against code word of day
const codes = [
    {
        date : startTime,
        code : 'ALL STARS'
    },
    {
        date : startTime + (dayMSeconds * 1),
        code : 'ENSUITE'
    },
    {
        date : startTime + (dayMSeconds * 2),
        code : 'TERRACE'
    },
    {
        date : startTime + (dayMSeconds * 3),
        code : 'CHALLENGE'
    },
    //code 5 starts sunday 15th
    {
        date : startTime + (dayMSeconds * 7),
        code : 'TOOLS DOWN'
    }
]

/* GET home page. */
router.post('/', function(req, res, next) {
    
    //console.log(req.body);
    if (!req.body.code) {
        res.status(200);
        return res.json({success:false});
    } 
    const userCode = req.body.code;

    const currentDate = new Date().getTime();

    for (let i=0; i<codes.length - 1; i+=1) {
        const {date, code} = codes[i];

        if (
            currentDate > date && currentDate < codes[i+1].date
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

    //check last days code
    const {date, code} = codes[codes.length-1];
    if (
        currentDate > date
    ) {
        if (code.toLowerCase() === userCode.toLowerCase()) {
            res.status(200);
            return res.json({success: true});
        } else {
            res.status(200);
            return res.json({success: false});
        }
    }
    res.status(200);
    return res.json({success: false});
    

});


export default router;
