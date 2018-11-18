'use strict';

var expect = require('chai').expect;
const MongoClient = require('mongodb');
const { ObjectID } = require('mongodb');

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
        board,
      } = req.params
      const created_on = new Date()
      const collection = db.collection('threads')
      const data = {
        created_on,
        bumped_on: created_on,
        reported: false,
        replies: [],
        text,
        delete_password,
        board,
      }
      await collection.insertOne(data)
      res.redirect(`/b/${board}`)
    })
    .get((req, res) => {
      req.send('')
    })
    
  app.route('/api/replies/:board')
   .post(async (req, res) => {
      const {
        text,
        delete_password,
        board,
        thread_id
      } = req.params
      const created_on = new Date()
      const data = {
        text, 
        created_on,
        delete_password, 
        reported: false,
      }
      await db.collection('threads').findOneAndUpdate({ _id: ObjectID(thread_id) }, { bumped_on: created_on })
      
      await db.collection('replies').insertOne({ _id: ObjectID(thread_id) }, { $push: { replies: data} })
      
      res.redirect(`/b/${board}/${thread_id}`)
    })
};
