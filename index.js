const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
});

router.post('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/put', (req, res) => {
    sess['ACCOUNT'] = req.body.address;
    console.log(sess['ACCOUNT']);
    res.send('ok');
});

router.post('/delete', (req, res) => {
    sess['ACCOUNT'] = '';
    console.log(sess);
    res.send('ok');
});

router.post('/get', (req, res) => {
    res.send(sess['ACCOUNT']);
    console.log(sess);
});

module.exports = router;