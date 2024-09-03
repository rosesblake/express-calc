const express = require('express');

const app = express();

app.use(express.json());

function validateNums(req, res, next) {
    const nums = req.params.nums;

    if (!nums) {
        return res.status(400).json({ error: 'nums are required.' });
    }

    const numsArr = nums.split(',').map(Number);
    const hasInvalidNums = numsArr.some(isNaN);

    if (hasInvalidNums) {
        return res.status(400).json({ error: 'Some values are not valid numbers.' });
    }

    req.numsArr = numsArr;
    next();
}

app.get('/mean/:nums', validateNums, (req, res) => {
    const numsArr = req.numsArr;
    const mean = numsArr.reduce((acc, num) => acc + num, 0) / numsArr.length;
    return res.json({
        response: {
            operation: 'mean',
            value: mean
        }
    });
});

app.get('/median/:nums', validateNums, (req, res) => {
    const numsArr = req.numsArr;
    numsArr.sort((a, b) => a - b);
    const mid = Math.floor(numsArr.length / 2);
    const median = numsArr.length % 2 === 0
        ? (numsArr[mid - 1] + numsArr[mid]) / 2
        : numsArr[mid];
    return res.json({
        response: {
            operation: 'median',
            value: median
        }
    });
});

app.get('/mode/:nums', validateNums, (req, res) => {
    const numsArr = req.numsArr;
    const frequency = {};
    let maxFreq = 0;
    let mode = [];

    for (let num of numsArr) {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            mode = [num];
        } else if (frequency[num] === maxFreq) {
            mode.push(num);
        }
    }

    if (mode.length === numsArr.length) {
        mode = [];
    }

    return res.json({
        response: {
            operation: 'mode',
            value: mode.length === 1 ? mode[0] : mode
        }
    });
});

app.listen(3000, () => {
    console.log('App server running on port 3000');
});
