var express = require('express');
var app = express();
var apiRouter = require('./routes/api');



app.use('/api', apiRouter);
app.listen(4000, function () {
  console.log('express listening on port 4000')


});