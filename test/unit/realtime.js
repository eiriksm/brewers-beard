var rt = require('../../src/lib/realtime');

var should = require('should');

var lastOn, lastSend, lastMsg;

var events = require('events');
var ev = new events.EventEmitter();

ev.send = function(e, m) {
  lastSend = e;
  lastMsg = m;
};
ev.write = ev.send;

describe('Realtime handling', function() {
  it('Should export a function', function() {
    rt.should.be.instanceOf(Function);
  });

  it('Should send back "authed" when we emit auth', function() {
    rt(ev);
    ev.emit('auth', 'something');
    lastSend.should.equal('authed');
    lastMsg.authed.should.equal('something');
  });

  it('Should keep around a temp and send it back when we want it', function(done) {
    rt(ev);
    ev.emit('temp', 123);
    ev.emit('gettemp');
    // Give it a little more than a second.
    setTimeout(function() {
      lastSend.should.equal('newtemp');
      lastMsg.should.equal(123);
      done();
    }, 1500);
  });
});
