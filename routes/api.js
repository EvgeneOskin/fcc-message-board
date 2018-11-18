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
      const data = {
        created_on,
        bumped_on: created_on,
        reported: false,
        replies: [],
        text,
        delete_password,
        board,
      }
      const collection = db.collection('threads')
      await collection.insertOne(data)
      res.redirect(`/b/${board}`)
    })
    .get((req, res) => {
      req.send('')
    })
    .put(async (req, res) => {
      const {thread_id } = req.params
      await db.collection('threads').findOneAndUpdate({ _id: ObjectID(thread_id) }, { reported: true })
      res.send('success')
    })
    .delete(async (req, res) => {
      const { thread_id, delete_password } = req.params
      const value = await db.collection('threads').findOneAndDelete({thread_id, delete_password})
      if (!value) {
        res.send('incorrect password')
      } else {
        res.send('success')
      }
      
    })
    
  app.route('/api/replies/:board')
   .post(async (req, res) => {
      const {
        text,
        delete_password,
        board,
        thread_id,
      } = req.params
      const created_on = new Date()
      const data = {
        text, 
        created_on,
        delete_password, 
        reported: false,
        thread_id,
      }
      await db.collection('threads').findOneAndUpdate({ _id: ObjectID(thread_id) }, { bumped_on: created_on })
      
      await db.collection('replies').insertOne({ data })
      
      res.redirect(`/b/${board}/${thread_id}`)
    })
    .get(async (req, res) => {
      const { thread_id } = res.query
      
    })
    .put(async (req, res) => {
      const {thread_id, reply_id, board } = req.params
      await db.collection('replies').findOneAndUpdate({ thread_id, reply_id }, { reported: true })
      res.send('success')
    })
    .delete(async (req, res) => {
      const { thread_id, delete_password } = req.params
      const value = await db.collection('threads').findOneAndUpdate(
        {thread_id, delete_password}, { text: '[deleted]' }
      )
      if (!value) {
        res.send('incorrect password')
      } else {
        res.send('success')
      }
    })
};
