var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

router.get('/test', (req, res) => {
  res.json({ result: true })
})

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants !' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: { $regex: new RegExp(req.body.email, 'i') } }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        poste: "Developpeur",
        token: uid2(32),
        isAdmin: true,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, email: newDoc.email, poste: newDoc.poste, isAdmin : newDoc.isAdmin });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'Utilisateur déja existant' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  User.findOne({ email: { $regex: new RegExp(req.body.email, 'i') } }).then(data => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, email: data.email, poste: data.poste, isAdmin : data.isAdmin });
    } else {
      res.json({ result: false, error: 'Utilisateur ou mot de passe incorrect' });
    }
  });
});

module.exports = router;
