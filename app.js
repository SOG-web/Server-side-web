/* eslint-disable no-undef */
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(
  '/css',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/jquery/dist')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/popper.js/dist')),
);
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'My Library', list: ['a', 'b', 'c'] });
});

app.listen(port, () => {
  debug(`server listing on ${chalk.green(port)}`);
});
