var express = require('express');
var router = express.Router();


//=========Bluebird===========

var bluebird = require("bluebird");
//=========Redis==============
var redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
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

router.get('/populate_redis', function(req, res, next) {
  for(var i=1; i<=255; i++){
    redisClient.set(i,Math.round(Math.random() * 20));
  }
  res.send("Populated");
});

router.get('/redis_status', function(req, res, next) {
  for(var i=1; i<=255; i++){
    redisClient.get(i, function (error, result) {
      if (error) {
          console.log(error);
          //throw error;
      }
      console.log(result);
      
    });
  }
  res.send("Check terminal");
});


/* GET home page. */
router.get('/view_chart', function(req, res, next) {
  
  

  /*
  for(var i=1; i<=255; i++){
    redisClient.get(i, function (error, result) {
      if (error) {
          console.log(error);
          //throw error;
      }
      
      addToList(result);
    
      
    });
    function addToList(result){
      console.log(JSON.stringify({key:i,val:result}));
      all_values.push({key:i,val:result});
    }
  }
  */
  getDataForChart().then((results)=>{
    console.log(JSON.stringify(results));
  });
  
  res.render('redis', { title: 'Express' });
});

var getDataForChart = function(){
  var all_values = [];
  for(var i=1; i<=255; i++){  
    all_values.push(
      redisClient.getAsync(i).then(function(reply){
        console.log("Reply from async: "+reply);
        return reply;
      })
    );   
  }
  return Promise.all(all_values);
} 

var addToList = function(key, result){
  console.log("callback called"+JSON.stringify({key:key,val:result}));
  return {key:key,val:result};
  //callback(values);
}

var mainCaller = function(values_array){
  for(var i=1; i<=255; i++){
    getDataForChart(values_array,i,addToList);
  }
  return values_array;
}


module.exports = router;
