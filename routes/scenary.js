var express = require("express");
var router = express.Router();

const Scenary = require("../models/scenary");
const { checkBody } = require("../modules/checkBody");
const User = require('../models/users')

router.get("/test", (req,res) => {
  res.json({result:true, message: "TEST PASSED !!"})
})

router.get("/token/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate({
      path: 'scenary',
      populate: 'client'
    })
    .then((data) => {
      if (data) {
        res.json({ result: true, userInfos: data });
      } else {
        res.json({ message: "rien trouvé" });
      }
    });
});

router.post("/new", (req, res) => {
  if (
    !checkBody(req.body, [
      "client",
      "name",
      "type",
      "duration",
      "amount",
      "contratStart",
      "contratEnd",
      "residualValue",
      "links",
      "marge",
    ])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants !" });
    return;
  }

  // Check if the scenary has not already been registered
  Scenary.findOne({name: { $regex: new RegExp(req.body.name, 'i') }} ).then(
    (data) => {
      if (data === null) {
        const newScenary = new Scenary({
          client: req.body.client,
          name: req.body.name,
          type: req.body.type,
          duration: req.body.duration,
          amount: req.body.amount,
          creationDate: req.body.creationDate,
          contratStart: req.body.contratStart,
          contratEnd: req.body.contratEnd,
          residualValue: req.body.residualValue,
          links: req.body.links,
          marge: req.body.marge,
        });
        newScenary.save().then((newScenary) => {
          User.updateOne({ token: req.body.token },{$push: { scenary: newScenary._id },})
          .then(data => {
            res.json({ result: true, contrat: newScenary });
          })
        });
      } else {
        // Scenary already exists in database
        res.json({ result: false, error: "Scenario déja existant" });
      }
    }
  );
});

// router.get("/all", (req, res) => {
//   Scenary.find().then((data) => {
//     if (data) {
//       res.json({ result: true, scenaries: data });
//     } else {
//       res.json({ result: false, error: "Pas de scénarios !" });
//     }
//   });
// });

router.get("/:id", (req, res) => {
  Scenary.findById({ _id: req.params.id }).then((data) => {
    if (data) {
      res.json({ result: true, scenary: data });
    } else {
      res.json({ result: false, error: "Scenario pas trouver via l'ID !" });
    }
  });
});

router.delete("/:id", (req, res) => {
  Scenary.deleteOne({ _id: req.params.id }).then((data) => {
    if (data) {
      res.json({ result: true, scenary: data });
    } else {
      res.json({ result: false, error: "Scenario pas trouver !" });
    }
  });
});

router.put("/update/:id", (req, res) => {
  Scenary.updateOne({ _id: req.params.id },
    {
      client: req.body.client,
      name: req.body.name,
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
    Scenary.findById({ _id: req.params.id }).then((data) => {
      if (data) {
        res.json({ result: true, scenary: data });
      } else {
        res.json({ result: false, error: "Scenario pas trouver !" });
      }
    });
  });
});



module.exports = router;
