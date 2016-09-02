var express = require('express');
var router = express.Router();
const personifyController = require('../controllers/personify');




router.get('/dummy', function(req, res) {
  res.status(200).json('dummy');
});

router.get('/personify/:username', function(req, res){
  personifyController.makeProfileFromTweets(req.params.username, function(err, data){
    if (err){
      // handle error.
    }

    res.send(data);
  })
});


module.exports = router;