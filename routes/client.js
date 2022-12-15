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
    //vérifie l'existence ou non du client
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
            client: newDoc._id,
            tel: e.phoneNumber,
            name: req.body.name,
            firstname: e.firstname,
            email: e.email,
            poste: e.poste,
          });
          //sauvegarde le nouvel interlocuteur
          newInterlocutor.save().then((newInterloc) => {
            //ajoute l'interlocuteur au document du client correspondant
            Client.updateOne(
              { name: req.body.name },
              {
                $push: { interlocutors: newInterloc._id },
              },
              function (error, result) {
                if (error) {
                  // Si une erreur est retournée, affiche les détails de l'erreur
                  console.log(
                    "Erreur lors de la mise à jour de l'objet client : ",
                    error
                  );
                  res.json({
                    result: false,
                    error: "Error updating client object",
                  });
                } else {
                  // Si la mise à jour réussit, affiche le résultat de la mise à jour
                  console.log(
                    "Résultat de la mise à jour de l'objet client : ",
                    result
                  );
                }
              }
            );
          });
        });
        // Cherche le user grace au token
        User.updateOne(
          { token: req.body.token },
          {
            $push: { clients: newDoc._id },
          },
          function (error, result) {
            if (error) {
              // Si une erreur est retournée, affiche les détails de l'erreur
              console.log(
                "Erreur lors de la mise à jour de l'objet user : ",
                error
              );
              res.json({ result: false, error: "Error updating user object" });
            } else {
              // Si la mise à jour réussit, affiche le résultat de la mise à jour
              console.log(
                "Résultat de la mise à jour de l'objet user : ",
                result
              );
            }
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
