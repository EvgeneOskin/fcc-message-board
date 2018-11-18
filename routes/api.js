'use strict';

var expect = require('chai').expect;
const MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB

module.exports = function (app) {
  let db;
  MongoClient.connect(CONNECTION_STRING, function(err, _db) {
    if (err) {
      console.error(err) 
      return
    }
    db = _db.db("eoskin-stocks")
  })  
  
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      const {
        text,
        delete_password,
        board
      } = req.data
      const created_on = new Date()
      const data = {
        created_on,
        bumped_on: created_on,
        reported: false,
        replies: [],
      }
      const collection = db.collection('messages')
      res.redirect(`/b/${board}`)
        /*_id,
        text, 
        created_on,
        bumped_on,
        reported,
        delete_password,
        */
      })
    })
    
  app.route('/api/replies/:board');

};
