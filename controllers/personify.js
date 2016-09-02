const async = require('async');
const watson = require('watson-developer-cloud');
const Twitter = require('twitter');

const config = require('../config');
const helpers = require('../helpers/helpers');

var client = new Twitter(config.twitterConfig);
var personality_config = {
  username: config.personalityConfig.service_username,
  password: config.personalityConfig.service_password,
  version: 'v2'
};
var personality_insights = watson.personality_insights(personality_config);


module.exports = {
  makeProfileFromTweets : makeProfileFromTweets

};

function makeProfileFromTweets (username, finalCallback) {
  async.waterfall([
    function (callback) {
      var params = {
        screen_name : username,
        count: 100

      };
      client.get('statuses/user_timeline', params, function (err, tweets, res) {
        if(err || !tweets){
          return err? callback(err): callback(new Error('Problem getting tweets'));
        }
        callback(null, tweets)

      })
    },
    function (tweetsObjArr, callback) {

      async.reduce(tweetsObjArr, '', function (memo, tweetObj, callback) {
        var tweet = tweetObj.text;
        callback(null, memo += tweet);

      }, function(err, reduceResult){
        var params = {
          "text": reduceResult
        };
        callback(null , params);
      })

    }

  ],function(err, params){

    personality_insights.profile(params, function (err , res) {
      if(err){
        return finalCallback(err);
      }

      var rest = res.tree.children[0].children[0].children;
      console.log(rest);
      // finalCallback(null, rest);
      async.map(rest, function(item, callback){
        var obj = helpers.makeCharacterisitcObj(item.name, item.percentage * 100);
        callback(null,obj);
      },function(err, mapResult){
        console.log(mapResult);
        var data = {
          username: username,
          profile : mapResult
        };
        finalCallback(null, data);
      });

    });
  })
}

