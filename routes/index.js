var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function (req, res, next) {
  res.render('index', { title: 'Express!!!!!!' });
});

router.get('/test2', function (req, res, next) {
  res.json({
    title: "good"
  })
});

module.exports = router;
