var koa = require('koa');
var app = koa();

// logger
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
});

// response
app.use(function *(){
  this.body = 'Hello World';
});

app.server = app.listen(3000);

module.exports = app;
