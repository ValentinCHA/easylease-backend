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
    !checkBody(req.body, [
      "name",
      "firstname",
      "poste",
      "tel",
      "email",
      "client",
    ])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants !" });
    return;
  }

  Interlocutor.findOne({
    name: { $regex: new RegExp(req.body.name, "i") },
  }).then((data) => {
    console.log("FindOne Interlocuteur : ", data);
    if (!data || data.name !== req.body.name) {
      const newInterlocutor = new Interlocutor({
        name: req.body.name,
        firstname: req.body.firstname,
        poste: req.body.poste,
        tel: req.body.tel,
        email: req.body.email,
        client: req.body.client,
      });
      newInterlocutor.save().then((newInterlocutor) => {
        console.log({ "nouvel interlocuteur ajouté en db": newInterlocutor });
        res.json({ result: true, newInterlocutor: newInterlocutor });
      });
    } else {
      console.log("Interlocuteur déjà existant ");
      res.json({ result: false, error: "Interlocuteur déjà existant !" });
    }
  });
});
module.exports = router;
