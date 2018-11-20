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
            assert.equal(res.status, 302);
            done()
          })
        })
      })
    });
    
    suite('GET', function() {
      test('get a thread', (done) => {
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
            assert.property(res.body[0], 'delete_password')
            assert.property(res.body[0], 'reported')
            done()
          })
        })
      })
    });
    
    suite('DELETE', function() {
      
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
