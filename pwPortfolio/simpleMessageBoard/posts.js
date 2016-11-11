'use strict';

const path = require('path');
const fs   = require('fs');
const uuid = require('uuid');

let Posts = {
  get(cb){
    let dbData;
    fs.readFile(path.join(__dirname, './db.json'), (err, data) => {
      if(err) cb(err);
      try {
        dbData = JSON.parse(data);
      } catch(err){
        cb(err);
      }; cb(null, dbData);
    });
  },
  getById(id, cb){
    let dbData;
    fs.readFile(path.join(__dirname, '.db/json'), (err, data)=> {
      if(err) cb(err);
      try {
        dbData = JSON.parse(data);
      } catch(err){
        cb(err);
      };
      dbData.forEach(dbPost => {
        if(dbPost.id === id) cb(dbPost);
      });
    });
  },
  create(body, cb){
    let dbData;
    fs.readFile(path.join(__dirname, './db.json'), (err, data)=> {
      if(err) cb(err);
      try {
        dbData = JSON.parse(data);
      } catch(err){
        cb(err);
      };
      let id = uuid.v1();
      let date = Date(Date.now());
      let newPost = {id, date,
        author : body.author,
        post   : body.post,
        sortD  : Date.now()
      };
      dbData.push(newPost);
      fs.writeFile(path.join(__dirname, './db.json'), JSON.stringify(dbData), err => {
        err ? cb(err) : cb(null);
      });
    });
  },
  edit(editObj, cb){
    let dbData;
    fs.readFile(path.join(__dirname, './db.json'), (err, data)=> {
      if(err) cb(err);
      try {
        dbData = JSON.parse(data);
      } catch(err) {
        cb(err);
      };
      dbData.forEach(dbPost => {
        if(dbPost.id === editObj.id) {
          dbPost.post = editObj.post;
          dbPost.date = Date(Date.now());
        };
      });
      fs.writeFile(path.join(__dirname, './db.json'), JSON.stringify(dbData), err => {
        err ? cb(err) : cb(null);
      });
    });
  },
  remove(id, cb){
    let dbData;
    fs.readFile(path.join(__dirname, './db.json'), (err, data)=> {
      if(err) return cb(err);
      try {
        dbData = JSON.parse(data);
      } catch(err){
        cb(err);
      };
      let newData = dbData.filter(dbPost => {
        return dbPost.id !== id;
      });
      fs.writeFile(path.join(__dirname, './db.json'), JSON.stringify(newData), err => {
        err ? cb(err) : cb(null);
      });
    });
  }
};


module.exports = Posts;
