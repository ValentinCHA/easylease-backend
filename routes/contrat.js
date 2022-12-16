var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Contrat = require("../models/contrat");
const Interlocutor = require("../models/interlocutor");

router.get("/allContrat", (req, res) => {
  Contrat.find().then((data) => {
    if (data) {
      res.json({ result: true, contrat: data });
    } else {
      res.json({ result: false, error: "problème du get" });
    }
  });
});

router.get("/:_id", (req, res) => {
  Contrat.findById({ _id: req.params._id })
    //.populate("client")
    .populate("interlocutor")
    .then((data) => {
      if (data) {
        res.json({ result: true, contrat: data });
      }
    });
});

router.post("/addContrat", (req, res) => {
  // if (
  //   !checkBody(req.body, [
  //     "client",
  //     "name",
  //     "type",
  //     "duration",
  //     "amount",
  //     "creationDate",
  //     "contratStart",
  //     "contratEnd",
  //     "residualValue",
  //     "links",
  //   ])
  // ) {
  //   res.json({ result: false, error: "Champs vides ou manquants !" });
  //   return;
  // }

  Contrat.findOne({ name: { $regex: new RegExp(req.body.name, "i") } }).then(
    (data) => {
      if (!data) {
        const newContrat = new Contrat({
          client: req.body.client,
          name: req.body.name,
          interlocutor: req.body.interlocutor,
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

router.put("/update/:id", (req, res) => {
  Contrat.updateOne(
    { _id: req.params.id },
    {
      client: req.body.client,
      name: req.body.name,
      interlocutor: req.body.interlocutor,
      type: req.body.type,
      duration: req.body.duration,
      amount: req.body.amount,
      creationDate: req.body.creationDate,
      contratStart: req.body.contratStart,
      contratEnd: req.body.contratEnd,
      residualValue: req.body.residualValue,
      links: req.body.links,
      marge: req.body.marge,
    }
  ).then(() => {
    Contrat.findById({ _id: req.params.id }).then((data) => {
      if (data) {
        res.json({ result: true, contrat: data });
      } else {
        res.json({ result: false, error: "Contrat introuvable" });
      }
    });
  });
});

router.delete("/:id", (req, res) => {
  Contrat.deleteOne({ _id: req.params.id }).then((data) => {
    if (data) {
      res.json({ result: true, contrat: data });
    } else {
      res.json({ result: false, error: "Contrat introuvable !" });
    }
  });
});

module.exports = router;
