var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const mongoose = require("mongoose");

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
      } else {
        res.json({ result: false, error: "Interlocuteur pas trouvé via l'id" });
      }
    });
});

router.post("/addInterlocuteur", (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "firstname",
      "poste",
      "phone",
      "email",
      "client",
    ])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants !" });
    return;
  }

  // Vérification que req.body.client est bien un tableau
  if (!Array.isArray(req.body.client)) {
    req.body.client = Array.prototype.slice.call(req.body.client);
  }

  // Vérification que chaque élément du tableau est un objet ObjectId valide
  req.body.client.forEach((client) => {
    if (!mongoose.Types.ObjectId.isValid(client)) {
      res.json({
        result: false,
        error: "Client n'est pas un objet ObjectId valide",
      });
      return;
    }
  });

  Interlocutor.findOne({
    name: { $regex: new RegExp(req.body.name, "i") },
  }).then((data) => {
    console.log("FindOne Interlocuteur : ", data);
    if (!data || data.name !== req.body.name) {
      const newInterlocutor = new Interlocutor({
        name: req.body.name,
        firstname: req.body.firstname,
        poste: req.body.poste,
        phone: req.body.phone,
        email: req.body.email,
        client: req.body.client, // Utilisation de req.body.client comme un tableau d'objets ObjectId valides
      });
      newInterlocutor.save().then((newInterlocutor) => {
        console.log({ "POST INTERLOCUTOR => ": newInterlocutor });
        res.json({ result: true, newInterlocutor: newInterlocutor });
      });
    } else {
      console.log("Interlocuteur déjà existant ");
      res.json({ result: false, error: "Interlocuteur déjà existant !" });
    }
  });
});

module.exports = router;
