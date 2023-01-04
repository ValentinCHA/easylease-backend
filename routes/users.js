var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

router.get('/test', (req, res) => {
  res.json({ result: true })
});

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
  console.log(req.body);
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  User.findOne({ email: { $regex: new RegExp(req.body.email, 'i') } }).then(data => {
    console.log(data);
    // FAIRE UN IF DATA NULL = RETURN
    if (!data) {
      res.json({result: false, error: "Utilisateur innexistant"})
      return
    }
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, email: data.email, poste: data.poste, isAdmin : data.isAdmin });
    } else {
      res.json({ result: false, error: 'Utilisateur ou mot de passe incorrect' });
    }
  });
});

router.post('/updateMdp', (req, res) => {

  if (!checkBody(req.body, ['email', 'currentPassword', 'newPassword', 'confirmPassword'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  // Recherche l'utilisateur dans la base de données
  User.findOne({ email: { $regex: new RegExp(req.body.email, 'i') } }).then(user => {
    if (!user) {
      res.json({result: false, error: "Utilisateur innexistant"})
      return;
    }
    // Vérifie si le mot de passe actuel est correct
    if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
      res.json({ result: false, error: 'Mot de passe actuel incorrect' });
      return;
    }
    // Vérifie si le nouveau mot de passe et la confirmation sont identiques
    if (req.body.newPassword !== req.body.confirmPassword) {
      res.json({ result: false, error: 'Le nouveau mot de passe et la confirmation ne sont pas identiques' });
      return;
    }
    // Hashage du nouveau mot de passe
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    // Met à jour le mot de passe de l'utilisateur dans la base de données
    User.updateOne({ email: { $regex: new RegExp(req.body.email, 'i') } }, { $set: { password: hashedPassword } })
      .then(() => {
        res.json({ result: true });
      })
      .catch(err => {
        // Si une erreur se produit, renvoie l'erreur
        res.json({ result: false, error: err });
      });
  });
});

router.delete('/delete/:token', (req,res) => {
  User.deleteOne({token: req.params.token})
  .then (data => {
    if (data) {
      res.json({result: true, resultat: data})
    } else {
      res.json({result: false, error : "User non supprimé"})
    }
  })
});

module.exports = router;
