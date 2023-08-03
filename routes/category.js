var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    categoryLists:[
    {name: '전체보기', fitler: ""},
    {name: '제과', fitler: ""},
    {name: '제빵', fitler: ""},
  ]
  })
});

  
module.exports = router;
