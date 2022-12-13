var express = require('express');
var router = express.Router();

router.get('/test', (req, res) => {

  res.json({ result: true })
})

module.exports = router;