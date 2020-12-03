const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRoutes = express.Router();

function router(nav) {
  authRoutes.route('/signUp')
    .get((req, res) => {
      res.render('index', {
        nav,
        title: 'signUp',
      });
    })
    .post((req, res) => {
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'LibraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to the DataBase Server');

          const db = client.db(dbName);

          const col = db.collection('users');
          const user = { username, password };
          const ans = await col.findOne({ username });
          debug(username);
          if (ans?.username === username) {
            // debug(ans);
            res.send('User already exist');
          } else {
            // debug(user);
            const result = await col.insertOne(user);
            req.logIn(result.ops[0], () => {
              res.redirect('/auth/profile');
            });
          }
        } catch (err) {
          debug(err);
        }
      }());
    });

  authRoutes.route('/signIn')
    .get((req, res) => {
      res.render('signIn', {
        nav,
        title: 'signIn',
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));

  authRoutes.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  authRoutes.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
  });
  return authRoutes;
}

module.exports = router;
