const express = require('express');
const path = require('path');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const URL = 'mongodb://localhost:27017/pinapp';
const Pin  = require('./imgSchema.js');
const Board = require('./boardSchema.js');
const passport = require('passport');
const passportTwitter = require('passport-twitter');
const session = require('express-session');

var userObj;

//Configure twitter passport strategy
const twitterStrategy = passportTwitter.Strategy;

passport.use(new twitterStrategy({
  consumerKey: 'ga1rnpwhvd47Thrp9M4xnZcTe',
  consumerSecret: 'VldzYl96PcpwfsX0U0GRShHcWardHASeIvASmVX5kTIwiLFJbW',
  callbackURL: 'http://127.0.0.1:5000/auth/twitter/callback'},
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  })
);

//Passport session setup
app.use(session({
  secret: 'session secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//Login authentication route
app.get('/auth/twitter', passport.authenticate('twitter'));

//Passport-twitter callback route
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: 'http://127.0.0.1:3000/' }),
  (req, res) => {
    console.log('call me back ese');
    Board.find({user: req.user.username}, (err, board) => {
      console.log(board);
      if(board.length == 0){
        let newBoard = new Board({
          user: req.user.username,
          pins: []
        });
        newBoard.save((err) => {
          if(err) throw err;
          console.log('Saved new board!');
        });
      }
    });
    userObj = req.user;
    res.redirect('http://127.0.0.1:3000/');
  }
);

//Handle passport logout
app.get('/logout', (req, res) => {
  req.logout();
  console.log('User logged out!');
  // console.log('req.user: ',req.user);
  userObj = req.user;
  res.redirect('http://127.0.0.1:3000/');
});

//Connect to database using Mongoose
mongoose.connect(URL, (err, db) => {
  if(err) throw err;
  console.log('Connected to Mongoose!');
  app.listen(PORT, () => {
    console.log('Server listening on port '+PORT+'!');
  });
});
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

//Configure middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Answer API requests.
app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

//Get user object
app.get('/api/getuser', (req, res) => {
  res.send(userObj);
});

//Get all pinned images to display
app.get('/api/allpins', (req, res) => {
  Pin.find({}, (err, pins) => {
    if(err) throw err;
    res.send(pins);
  });
});

//Get my pinned images only
app.post('/api/getmypins', (req, res) => {
  Board.findOne({user: req.body.user}, (err, board) => {
    if(err) throw err;
    res.send(board.pins);
  });
  // Pin.find({user: req.body.user}, (err, pins) => {
  //   if(err) throw(err);
  //   res.send(pins);
  // });
});
//Handle a user pinning an existing image
app.post('/api/pinimage', (req, res) => {
  if(userObj !== undefined){
    Board.findOne({user: req.body.user}, (err, board) => {
      let alreadyPinned = false;
      board.pins.forEach((image) => {
        if(image._id == req.body.id){
          alreadyPinned = true;
        }
      });
      if(!alreadyPinned){
        Pin.findOne({_id: req.body.id}, (err, pin) => {
          if(err) throw err;
          Board.findOneAndUpdate(
            {user: req.body.user},
            {$push: {pins: pin}},
            (err, board) => {
              if(err) throw err;
              console.log('Pinned existing image to board!');
              res.send();
            });
        });
      }
      else{
        console.log('Already pinned, no go');
        res.send();
      }
    });
  } 
});
//Handle a user submitting a new pinned image
app.post('/api/submitpin', (req, res) => {
  // console.log(req.body);
  let newPin = new Pin({
    title: req.body.imgTitle,
    url: req.body.imgUrl,
    user: req.body.user,
    likes: 0
  });
  newPin.save((err) => {
    if(err) throw err;
    console.log('New pin saved successfully!');
    Board.findOneAndUpdate(
      {user: req.body.user},
      {$push: {pins: newPin}},
      (err, board) => {
        if(err) throw err;
        console.log('Added new pin to board!');
        res.send();
      }
    );
  });
  
})
//Handle deleting an image
app.post('/api/deleteimage', ((req, res) => {
  let pinId = mongoose.mongo.ObjectID(req.body.id);
  Pin.findOneAndRemove({_id: req.body.id}, (err, result) => {
    if(err) throw err;
    Board.findOneAndUpdate(
      {user: req.body.user},
      {$pull: {pins: {_id: pinId}}},
      (err, board) => {
        if(err) throw err;
        console.log('Unpinned image!');
        res.send();
      }
    );
  });
}));
//Handle unpinning an image
app.post('/api/unpin', (req, res) => {
  let pinId = mongoose.mongo.ObjectID(req.body.id);
  Board.findOneAndUpdate(
      {user: req.body.user},
      {$pull: {pins: {_id: pinId}}},
      (err, board) => {
        if(err) throw err;
        console.log('Unpinned image!');
        res.send();
      }
  );
});
//Handle a user liking an image
app.post('/api/like', (req, res) => {
  console.log('userobj: ',userObj);
  if(userObj !== undefined){
    Pin.findOne({_id: req.body.id}, (err, pin) => {
      let alreadyLiked = false;
      console.log('pin.liked: ', pin.liked);
      console.log(typeof(pin.likes));
      pin.liked.forEach((user) => {
        if(user == req.body.user){
          alreadyLiked = true;
        }
      });
      if(!alreadyLiked){
        Pin.findOneAndUpdate(
          {_id: req.body.id},
          {$inc: {likes: 1},
          $push: {liked: req.body.user}},
          (err, pin) => {
            console.log('Added like!');
            if(err) throw err;
            res.send();
          }
        )
      }
      else{
        Pin.findOneAndUpdate(
          {_id: req.body.id},
          {$inc: {likes: -1},
          $pull: {liked: req.body.user}},
          (err, pin) => {
            console.log('Removed like!');
            if(err) throw err;
            res.send();
          }
        )
      }
    });
  }
})
// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

