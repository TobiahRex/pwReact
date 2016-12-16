import fs from 'fs';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'bodyparser';
import http from 'http';
import dotenv from 'dotenv';

import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';

mongoose.Promise = Promise;

dotenv.config({ silent: true });
const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost/pWebsiteReact';
const BUILD = process.env.NODE_ENV || 'development';
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res) => {
  const resRef = res;
  resRef.handle = (err, data) =>
  res.status(err ? 400 : 200).send(err || data);
  next();
});

if (BUILD === 'development') {
  const compiler = webpack(webpackConfig);

  app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(hotMiddleware(compiler));
}
