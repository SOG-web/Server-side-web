/* eslint-disable no-undef */
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const sql = require('mssql');

const app = express();
const port = process.env.PORT || 4000;

// const config = {
//   user: 'library',
//   password: 'olaleka?!n1',
//   server: 'node2.database.windows.net',
// You can use 'localhost\\instance' to connect to named instance
//   database: 'nodewebapp',

//   option: {
//     encrypt: true,
//   },
// };

// sql.connect(config).catch((err) => debug(err));

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/author', title: 'Author' },
];

// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));
require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public')));

app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/jquery/dist')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/popper.js/dist')),
);

const bookRoutes = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRoutes = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRoutes);
app.use('/admin', adminRouter);
app.use('/auth', authRoutes);
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    nav: [
      { link: '/books', title: 'Books' },
      { link: '/authors', title: 'Authors' },
    ],
    title: 'Library',
  });
});

app.listen(port, () => {
  debug(`server listing on ${chalk.green(port)}`);
});
