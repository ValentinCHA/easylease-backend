var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Contrat = require("../models/contrat");

router.get("/allContrat", (req, res) => {
  Contrat.find().then((data) => {
    if (data) {
      res.json({ result: true, contrat: data });
    } else {
      res.json({ result: false, error: "problème du get" });
    }
  });
});

router.get("/contrat/:_id", (req, res) => {
  Contrat.findById({ _id: req.params._id }).then((data) => {
    if (data) {
      res.json({ result: true, contrat: data });
    }
  });
});

router.post("/addContrat", (req, res) => {
  if (
    !checkBody(req.body, [
      "client",
      "name",
      "type",
      "duration",
      "amount",
      "creationDate",
      "contratStart",
      "contratEnd",
      "residualValue",
      "links",
    ])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants !" });
    return;
  }

  Contrat.findOne({ name: { $regex: new RegExp(req.body.name, "i") } }).then(
    (data) => {
      if (!data) {
        const newContrat = new Contrat({
          client: req.body.client,
          name: req.body.name,
          interlocutor: "639850781650e2947b80f6c5",
          type: req.body.type,
          duration: req.body.duration,
          amount: req.body.amount,
          creationDate: req.body.creationDate,
          contratStart: req.body.contratStart,
          contratEnd: req.body.contratEnd,
          residualValue: req.body.residualValue,
          links: req.body.links,
          marge: 10,
        });
        newContrat.save().then((newContrat) => {
          res.json({ result: true, contrat: newContrat });
        });
      } else {
        res.json({ result: false, error: "Contrat déjà existant !" });
      }
    }
  );
});
module.exports = router;
