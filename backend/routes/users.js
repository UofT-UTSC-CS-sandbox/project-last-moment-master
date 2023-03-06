import jwt from 'jsonwebtoken';
import auth0 from 'auth0-js';
import bcrypt from "bcrypt";
import { Router } from "express";
import { User } from '../model/userModel.js';


const url = "http://localhost:3000";
const domain = "dev-a6l74pvzmwqg5h8s.us.auth0.com";
const clientID = "OX8IzCO9NRge4U7OT3jTl4T32Wx4a9qu";
const callbackUrl = "http://localhost:3000/users/callback";

export const usersRouter = Router();

usersRouter.post('/signup', (req, res) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  if(!req.body.username){
    return res.status(400).json({ error: "Username is required." });
  }
  if(!req.body.email){
    return res.status(400).json({ error: "Email is required." });
  }
  if(!req.body.password){
    return res.status(400).json({ error: "Password is required." });
  }
  if(!req.body.role){
    return res.status(400).json({ error: "Role is required." });
  }

  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      return res.status(422).json({ error: "HELLO Email already exists." });
    }
    else {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        role: req.body.role,
      }).then((user) => {
        res.json({ user: user });
      }).catch((err) => {
        res.status(500).json({ error: err });
      });
    }
  });
});

usersRouter.post('/login', (req, res) => {
  User.find({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user === null) {
      return res.status(401).json({ error: "Incorrect username or password." });
    }
    const hash = user.password; // Load hash from your password DB.
    const password = req.body.password; // this is the password passed in by the user
    const result = bcrypt.compareSync(password, hash);
    // password incorrect
    if (!result) {
      return res.status(401).json({ error: "Incorrect username or password." });
    }

    // req.session.userId = user.id;
    // return res.json({ userInfo: user, userId: req.session.userId });
  }).catch((err) => {
    res.status(500).json({ error: err });
  });
});

usersRouter.get('/signout', function (req, res, next) {
  // req.session.destroy();
  return res.redirect("/");
});

usersRouter.post('/auth/signup', (req, res) => {
  const auth = new auth0.WebAuth({
    domain: domain,
    clientID: clientID,
    redirectUri: callbackUrl,
    logoutUrl: url,
  });

  auth.signup({
    connection: 'Username-Password-Authentication',
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    role: req.body.role,
  }, (err) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});


//auth0
usersRouter.get('/callback', (req, res) => {
  const auth = new auth0.WebAuth({
    domain: domain,
    clientID: clientID,
    redirectUri: callbackUrl,
    logoutUrl: url,
  });

  auth.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Save tokens to local storage
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime()));

      // Redirect to home page
      res.redirect('/');
    } else if (err) {
      // Handle error
      console.log(err);
      res.redirect('/');
    }
  });
});

