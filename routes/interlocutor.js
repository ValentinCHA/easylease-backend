var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Interlocutor = require("../models/interlocutor");

router.get("/allInterlocuteur", (req, res) => {
  Interlocutor.find().then((data) => {
    if (data) {
      res.json({ result: true, interlocutor: data });
    } else {
      res.json({ result: false, error: "problème du get interlocuteur" });
    }
  });
});

router.get("/:_id", (req, res) => {
  Interlocutor.findById({ _id: req.params._id })
    .populate("client")
    .then((data) => {
      if (data) {
        res.json({ result: true, contrat: data });
      }
    });
});

router.post("/addInterlocuteur", (req, res) => {
  if (
    !checkBody(req.body, ["nom", "prenom", "poste", "phone", "mail", "client"])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants !" });
    return;
  }

  Interlocutor.findOne({
    nom: { $regex: new RegExp(req.body.nom, "i") },
  }).then((data) => {
    if (!data) {
      const newInterlocutor = new Interlocutor({
        nom: req.body.nom,
        prenom: req.body.prenom,
        poste: req.body.poste,
        phone: req.body.phone,
        mail: req.body.mail,
        client: req.body.client,
      });
      newInterlocutor.save().then((newInterlocutor) => {
        res.json({ result: true, newInterlocutor: newInterlocutor });
      });
    } else {
      res.json({ result: false, error: "Interlocuteur déjà existant !" });
    }
  });
});
module.exports = router;
