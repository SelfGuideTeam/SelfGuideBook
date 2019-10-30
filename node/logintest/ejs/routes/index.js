var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // 렌더링 /get 대신 post로 쓰면 post방식으로 작동함.
});

module.exports = router;
