var express = require('express');
var router = express.Router();

//=========Redis==============
var redis = require('redis');
var redisClient = redis.createClient(process.env.REDIS_PORT || '6379',process.env.REDIS_URL || '127.0.0.1')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/redis_get', function(req, res, next) {
  var key = req.query.key;
  console.log(key);
  redisClient.get(key, function (error, result) {
      if (error) {
          console.log(error);
          //throw error;
      }
      res.send('GET result ->' + result);
  });
  //res.send('GET result ->' + result);
});



router.get('/redis_set', function(req, res, next) {
  var key = req.query.key;
  var value = req.query.val;
  console.log(key);
  console.log(value);
  var result = redisClient.set(key,value,redis.print);

  res.send(result);
});

module.exports = router;
