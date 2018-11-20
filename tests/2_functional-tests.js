/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    let thread_id = null
    
    suite('POST', function() {
      test('create a thread', (done) => {
        const payload = {
          text: 'ping',
          delete_password: 'delete'
        }
        chai.request(server)
          .post('/api/threads/fcc')
          .send(payload)
          .end((err, res) => {
            assert.equal(res.status, 200);
            done()
          })
      })
    })
    
    suite('GET', function() {
      test('get threads', (done) => {
        chai.request(server)
          .get('/api/threads/fcc')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], '_id')
            assert.property(res.body[0], 'text')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'bumped_on')
            assert.property(res.body[0], 'board')
            assert.notProperty(res.body[0], 'delete_password')
            assert.notProperty(res.body[0], 'reported')
            assert.property(res.body[0], 'replies')
            assert.isArray(res.body[0].replies, 'response should be an array');
            assert.isBelow(res.body.length, 11)
            assert.isBelow(res.body[0].replies.length, 4)
            thread_id = res.body[0]._id
            done()
          })
      })
    })
        
    suite('PUT', function() {
      test('report a thread', (done) => {
        chai.request(server)
          .put('/api/threads/fcc')
          .send({ thread_id })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'reported');
            done()
          })
      })
    });

    suite('DELETE', function() {
      test('delete a thread with invalid password', (done) => {
        chai.request(server)
          .delete('/api/threads/fcc')
          .send({ thread_id, delete_password: '' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done()
          })
      })
      test('delete a thread', (done) => {
        chai.request(server)
          .delete('/api/threads/fcc')
          .send({ thread_id, delete_password: 'delete' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done()
          })
      })
    });
    
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    let thread_id = null
    let reply_id = null
    
    test('create a thread for replies', (done) => {
        const payload = {
          text: 'ping',
          delete_password: 'delete a thread for replies'
        }
        chai.request(server)
          .post('/api/threads/fcc')
          .send(payload)
          .end((err, res) => {
            assert.equal(res.status, 200);
            chai.request(server)
            .get('/api/threads/fcc')
            .end((err, res) => {
              assert.equal(res.status, 200);
              thread_id = res.body[0]._id
              done()
            })
          })
      })
    suite('POST', function() {
      test('create a reply', (done) => {
        const payload = {
          text: 'pong',
          delete_password: 'delete_reply',
          thread_id,
        }
        chai.request(server)
          .post('/api/replies/fcc')
          .send(payload)
          .end((err, res) => {
            assert.equal(res.status, 200);
            done()
          })
      })
    });
    
    suite('GET', function() {
      test('get all replies', (done) => {
        chai.request(server)
          .get(`/api/replies/fcc?thread_id=${thread_id}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id')
            assert.property(res.body, 'text')
            assert.property(res.body, 'created_on')
            assert.property(res.body, 'bumped_on')
            assert.property(res.body, 'board')
            assert.notProperty(res.body, 'delete_password')
            assert.notProperty(res.body, 'reported')
            assert.property(res.body, 'replies')
            assert.isArray(res.body.replies, 'response should be an array');
            assert.property(res.body.replies[0], '_id')
            assert.property(res.body.replies[0], 'text')
            assert.property(res.body.replies[0], 'created_on')
            assert.notProperty(res.body.replies[0], 'delete_password')
            assert.notProperty(res.body.replies[0], 'reported')
            reply_id = res.body.replies[0]._id
            done()
          })
      })
    });

    suite('DELETE', function() {
       test('delete a thread with invalid password', (done) => {
        chai.request(server)
          .delete('/api/replies/fcc')
          .send({ thread_id, reply_id, delete_password: '' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done()
          })
      })
      test('delete a thread', (done) => {
        chai.request(server)
          .delete('/api/replies/fcc')
          .send({ thread_id, reply_id, delete_password: 'delete_reply' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done()
          })
      })
    });
    
    suite('PUT', function() {
      test('report a reply', (done) => {
        chai.request(server)
          .put('/api/replies/fcc')
          .send({ thread_id, reply_id })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'reported');
            done()
          })
      })
    });
    
  });

});
