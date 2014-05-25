var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var app = koa();
var http = require('http');
var Primus = require('primus');
var Emitter = require('primus-emitter');
var primusHandler = require('./lib/realtime');
var bunyan = require('bunyan');
var util = require('util');
var parse = require('co-body');
var rewrite = require('koa-rewrite');
app.log = bunyan.createLogger({
  name: "Brewers beard",
  serializers: {
    req: bunyan.stdSerializers.req
  }
});
// Export app.
module.exports = app;

// Try to get some config in here.
var yaml = require('js-yaml');
var fs = require('fs');
try {
  app.config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
}
catch (err) {
  // We had a problem with this. Try to use default config.
  console.error('Had problems reading config file. Using default config for now. This can be a problem, and you should take steps to get rid of this error!');
  app.config = yaml.safeLoad(fs.readFileSync('./default.config.yml', 'utf8'));
}

var requireDir = require('require-dir');
var routes = requireDir('./routes');

// logger
app.use(function *(next) {
  var start = new Date();
  if (this.req.method === 'POST' || this.req.method === 'PATCH') {
    this.postbody = yield parse(this, { limit: '10kb' });
  }
  yield next;
  var ms = new Date() - start;
  app.log.info('Responded in %d msecs on request', ms);
});

// See what we should rewrite.
var resources = requireDir('./routes/resources');
for (var prop in resources) {
  // Always rewrite all resources to / so we can look at them through angular.
  app.use(rewrite('/' + prop + '*', '/'));
}

app.use(serve(__dirname + '/../static/'));

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

require('./lib/db').init(function() {
  app.server = http.createServer(app.callback());
  app.primus = new Primus(app.server, { transformer: 'engine.io' });
  // add emitter to Primus
  app.primus.use('emitter', Emitter);
  app.primus.save(__dirname +'/../static/js/primus.js');
  app.primus.on('connection', primusHandler);
  app.server.listen(3000);
});
