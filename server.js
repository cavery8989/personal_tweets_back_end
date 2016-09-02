var express = require('express');
var app = express();
var apiRouter = require('./routes/api');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', apiRouter);
app.listen(4000, function () {
  console.log('express listening on port 4000')


});