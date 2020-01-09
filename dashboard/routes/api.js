var express = require('express');
var router = express.Router();


//=========Bluebird===========

var bluebird = require("bluebird");
//=========Redis==============
var redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
var redisClient = redis.createClient(process.env.REDIS_PORT || '6379',process.env.REDIS_URL || '127.0.0.1')

router.get('/', function(req, res, next) {
    res.json({more:'respond with a ok'});
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
router.get('/locations', function(req, res, next) {

  getDataForChart().
    then((results)=>{
      var topN = getNMaxElements(results,10);
      var labels = [];
      var values = [];
      
      topN.forEach((element) =>{
        var e = JSON.parse(element);
         labels.push(e.location);
         values.push(e.tip_amount);
      });
     
      console.log("values:"+values);
      console.log(JSON.stringify(topN));
      res.json({ labels: labels, values: values});
    }).
    catch((e)=>{
      console.log(e);
      res.json({status:"Error"});
    });
   
  
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
  //This will return after the async finish their job
  return Promise.all(all_values);
} 

var getNMaxElements = function(arrayToBeSorted, n){
  var arrayOfSizeN = new Array();
  for(var i=0; i < arrayToBeSorted.length; i++){
    arrayOfSizeN.push(arrayToBeSorted[i]);
    if(arrayOfSizeN.length > n){
      arrayOfSizeN.sort((a,b) => 
      { 
        var a_obj = JSON.parse(a);
        var b_obj = JSON.parse(b);
        return b_obj.tip_amount-a_obj.tip_amount; 
      });
      arrayOfSizeN.pop();
    }
  }
  return arrayOfSizeN;
}



module.exports = router;
