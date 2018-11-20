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
  let thread_id = null
  let reply_id = null
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('create a thread', (done) => {
        const payload = {
          text: 'ping',
          delete_password: 'delete'
        }
        chai.request(server)
          .post('/api/threads/fcc')
          .send(payload)
          .end(function(err, res){
            assert.equal(res.status, 200);
            done()
          })
      })
    })
    
    suite('GET', function() {
      test('get threads', (done) => {
        chai.request(server)
          .get('/api/threads/fcc')
          .end(function(err, res){
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
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done()
          })
      })
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
