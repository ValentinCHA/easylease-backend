var express = require("express");
var router = express.Router();
const Client = require("../models/client");
const User = require("../models/users");
const Interlocutor = require("../models/interlocutor");
const { checkBody } = require("../modules/checkBody");

router.post("/uploadClient", (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "interlocutors",
      "address",
      "numberOfEmployees",
      "chiffreAffaire",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Client.findOne({ name: req.body.name }).then((data) => {
    if (data === null) {
      const newClient = new Client({
        name: req.body.name,
        address: req.body.address,
        numberOfEmployees: req.body.numberOfEmployees,
        clientBirth: req.body.clientBirth,
        chiffre: req.body.chiffreAffaire,
      });
      // Sauvegarder le client créé
      newClient.save().then((newDoc) => {
        // console.log('nouveau client créé',newDoc);
        // crée un document interlocuteur pour chaque entrée du tableau interlocutors venant du front
        req.body.interlocutors.map((e) => {
          const newInterlocutor = new Interlocutor({
            client: req.body.name,
            tel: e.phoneNumber,
            name: req.body.interlocName,
            firstname: e.firstname,
            email: e.email,
            poste: e.poste,
          });
          newInterlocutor.save().then((newInterloc) => {
            Client.updateOne(
              { name: req.body.name },
              {
                $push: { interlocutors: newInterloc._id },
              }
            );
          });
        });
        // Cherche le user grace au token
        User.updateOne(
          { token: req.body.token },
          {
            $push: { clients: newDoc._id },
          }
        ).then((user) => {
          //   ajout du client dans le tableau user

          console.log("user", user);
          res.json({ result: true, message: "Bienvenue!" });
        });
      });
    } else {
      res.json({ result: false, error: "Client already exists" });
    }
  });
});

router.get("/test/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate("clients")
    .then((data) => {
      if (data) {
        res.json({ userInfos: data });
      } else {
        res.json({ message: "rien trouvé" });
      }
    });
});

module.exports = router;
