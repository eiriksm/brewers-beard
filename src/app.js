var koa = require('koa');
var route = require('koa-route');
var requireDir = require('require-dir');
var routes = requireDir('./routes');
var serve = require('koa-static');
var app = koa();
var bunyan = require('bunyan');
var util = require('util');
var parse = require('co-body');

var rewrite = require('koa-rewrite');

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
  if (this.req.method === 'POST' || this.req.method === 'PATCH') {
    this.postbody = yield parse(this, { limit: '10kb' });
  }
  yield next;
  var ms = new Date - start;
  app.log.info({req: this.req}, 'Responded in %d msecs on request', ms);
});

// See what we should rewrite.
var resources = requireDir('./routes/resources');
for (var prop in resources) {
  // Always rewrite all resources to / so we can look at them through angular.
  app.use(rewrite('/' + prop + '*', '/'));
}

app.use(serve(__dirname + '/static/'));

// REST for resources.
app.use(route.get('/api/:resource', routes.crud));
app.use(route.get('/api/:resource/:id', routes.crud));
app.use(route.post('/api/:resource', routes.crud));
app.use(route.patch('/api/:resource/:id', routes.crud));
app.use(route.delete('/api/:resource/:id', routes.crud));

// REST for subresources.
app.use(route.get('/api/:resource/:id/:subresource', routes.crud));
app.use(route.get('/api/:resource/:id/:subresource/:sid', routes.crud));
app.use(route.post('/api/:resource/:id/:subresource', routes.crud));
app.use(route.patch('/api/:resource/:id/:subresource/:sid', routes.crud));
app.use(route.delete('/api/:resource/:id/:subresource/:sid', routes.crud));

app.use(route.get('/poll/:user', routes.poll));

app.server = app.listen(3000);

module.exports = app;
