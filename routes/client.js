var express = require('express');
var router = express.Router();

const Client = require('../models/clients');
const User = require('../models/users');

router.get('/test/:token', (req, res) => {
    User.findOne({ token: req.params.token })
        .populate('client')
        .then(data => {
            if (data === true) {
                res.json({ userInfos: data })
            }
        })
})

module.exports = router