import jwt from 'jsonwebtoken';
import auth0 from 'auth0-js';
import bcrypt from "bcrypt";
import { Router } from "express";
import { User } from '../model/userModel.js';
import { UserAuth } from '../model/userAuthModel.js';
import { UserJwt } from '../model/userJWTModel.js';


const url = "http://localhost:3000";
const domain = "dev-a6l74pvzmwqg5h8s.us.auth0.com";
const clientID = "OX8IzCO9NRge4U7OT3jTl4T32Wx4a9qu";
const callbackUrl = "http://localhost:3000/users/callback";
const secret = "SkillVitrineSecret";

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
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(422).json({ error: "Email already exists." });
    }
    else {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        role: req.body.role,
      }).then((user) => {
        const header = JSON.stringify({
          alg: "HS256",
          typ: "JWT",
        });
        const payload = JSON.stringify({
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        });
        const token = jwt.sign({
          header,
          payload,
          Options: {
            expiresIn: "2h",
          },
        }, secret, {algorithm: 'HS256'},);
        UserJwt.create({
          email: user.email,
          jwt: token,
        }).then(() => {
          return res.json({ message: "User created successfully." });   
        }).catch((err) => {
          return res.status(500).json({ error: err });
        });
      }).catch((err) => {
        return res.status(500).json({ error: err });
      });
    }
  });
});

usersRouter.post('/login', (req, res) => {
  if(!req.body.email){
    return res.status(400).json({ error: "Email is required." });
  }
  if(!req.body.password){
    return res.status(400).json({ error: "Password is required." });
  }
  User.findOne({
    email: req.body.email,
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
    UserJwt.findOne({
      email: user.email,
    }).then((userJwt) => {
      const header = JSON.stringify({
        alg: "HS256",
        typ: "JWT",
      });
      const payload = JSON.stringify({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      const token = jwt.sign({
        header,
        payload,
        Options: {
          expiresIn: "2h",
        },
      }, secret, {algorithm: 'HS256'},);

      if (userJwt) {
        //if this user has a jwt, check if it is expired
        if(userJwt.updateAt > Date.now() - 7200000){
          return res.json({ message: "Not expired! Login successfully. Welcome." });
        } else {
          //if expired, update the jwt
          UserJwt.updateOne({
            email: user.email,
          }, {
            jwt: token,
          }).then(() => {
            return res.json({ message: "Update token! Login successfully. Welcome." });
          }).catch((err) => {
            return res.status(500).json({ error: err });
          });
        }
      } else{
        UserJwt.create({
          email: user.email,
          jwt: token,
        }).then(() => {
          return res.json({ message: "Login successfully. Welcome." });   
        }).catch((err) => {
          return res.status(500).json({ error: err });
        });
      }
    });
  }).catch((err) => {
    console.log("HJHHHHHHHH");
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

