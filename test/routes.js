var app = require('../src/app');
var brew = require('../src/routes/resources/brew');
var request = require('supertest');
var assert = require('assert');
var should = require('should');

// Override app log.
app.log = function() {
};
app.log.info = app.log;
app.log.error = app.log;

describe('Routes', function() {
  describe('Index file', function() {

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
  describe('API paths', function() {
    it('Should return something on /api', function(done) {
      request(app.server)
      .get('/api/brew/1')
      .end(function(err, res) {
        if (err) {
          done(err);
          return;
        }
        res.status.should.equal(200);
        done();
      });
    });

    it('Should return 404 when path is stupid', function(done) {
      request(app.server)
      .get('/api/WHATASTUPIDPATHTHISIS/1')
      .end(function(err, res) {
        if (err) {
          done(err);
          return;
        }
        res.status.should.equal(404);
        done();
      });
    });
  });

  describe('Brew', function() {
    it('Should return a list when not specifying id on GET', function(done) {
      request(app.server)
      .get('/api/brew')
      .expect(200)
      .expect('LIST VIEW', done);
    });

    it('Should return a brew when specifying id on GET', function(done) {
      request(app.server)
      .get('/api/brew/1')
      .expect(200)
      .expect('brew', done);
    });


  });

});
