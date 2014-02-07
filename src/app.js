var koa = require('koa');
var route = require('koa-route');
var requireDir = require('require-dir');
var routes = requireDir('./routes');
var serve = require('koa-static');
var app = koa();
var bunyan = require('bunyan');
var util = require('util');

var log = bunyan.createLogger({
  name: "Brewers beard",
  serializers: {
    req: bunyan.stdSerializers.req
  }
});
app.log = log;

// logger
app.use(function *(next) {
  var start = new Date;
  console.log(next)
  yield next;
  var ms = new Date - start;
  app.log.info({req: this.req}, 'Responded in %d msecs on request', ms);
});

app.use(serve(__dirname + '/static'));
app.use(route.get('/api/:resource/:id', routes.crud));
app.use(route.post('/api/:resource', routes.crud));
app.use(route.patch('/api/:resource/:id', routes.crud));
app.use(route.delete('/api/:resource/:id', routes.crud));
app.use(route.get('/api/:thing', routes.crud));
app.use(route.get('/poll/:user', routes.poll));

app.server = app.listen(3000);

module.exports = app;
