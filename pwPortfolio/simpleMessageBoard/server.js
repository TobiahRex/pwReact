'use strict';

const PORT        = process.env.PORT || 4000;
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const Posts       = require('./posts.js');
const path        = require('path');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));


app.get('/', (req, res) => {
  let indexPath = path.join(__dirname, './index.html');
  console.log('index: ', indexPath);
  res.sendFile(indexPath);
});

app.get('/posts', (req, res) => {
  Posts.get((err, dbData)=> {
    res.status(err ? 400 : 200).send(err || dbData);
  });
});
app.post('/posts', (req, res)=> {
  Posts.create(req.body, err => {
    err ? res.status(400) : Posts.get((err, dbData)=> {
      res.status(err ? 400 : 200).send(err || dbData);
    });
  });
});
app.get('/posts/:id', (req, res)=>{
  Posts.getById(req.params.id, (err, dbData)=>{
    res.status(err ? 400 : 200).send(err || dbData);
  });
});
app.put('/posts/:id', (req, res)=> {
  let editObj = {id : req.params.id, post : req.body.post};
  Posts.edit(editObj, err => {
    err ? res.status(400) : Posts.get((err, dbData) => {
      res.status(err ? 400 : 200).send(err || dbData);
    });
  });
});
app.delete('/posts/:id', (req, res)=>{
  Posts.remove(req.params.id, err => {
    err ? res.status(400) : Posts.get((err, dbData) => {
      res.status(err ? 400 : 200).send(err || dbData);
    });
  });
});


app.listen(PORT, err => {
  console.log(err || `Server on ${PORT}`);
});

module.exports = app;
