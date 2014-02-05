var app = require('../src/app.js');
var request = require('supertest');
var assert = require('assert');
var should = require('should');

describe('', function() {
  it('Should return something, when doing GET /', function(done) {
    request(app.server)
    .get('/')
    .end(function(err, res) {
      if (err) {
        done(err);
        return;
      }
      res.status.should.equal(200);
      done();
    });
  });
});
