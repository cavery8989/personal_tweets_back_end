const async = require('async');
const watson = require('watson-developer-cloud');

const Twitter = require('twitter');
const config = require('../config');

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
      finalCallback(null, res);
    });



  })
}

// var params = {
//   screen_name: username
// };
//
// client.get('statuses/user_timeline', params, function (err,tweet,  res) {
//
//   if(err) {
//     return console.log(err);
//   }
//
//   callback(null, tweet[0].text);
//
// });