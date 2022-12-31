var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const User = require("../models/users");
const Client = require("../models/client");

const Contrat = require("../models/contrat");
const Interlocutor = require("../models/interlocutor");

router.get("/allContrat", (req, res) => {
  Contrat.find()
    .populate("client")
    .then((data) => {
      if (data) {
        res.json({ result: true, contrat: data });
      } else {
        res.json({ result: false, error: "problème du get" });
      }
    });
});

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate({
      path: "contrats",
      populate: { path: "client" },
    })
    .then((data) => {
      if (data) {
        res.json({ result: true, userInfos: data });
      } else {
        res.json({result: false,  message: "rien trouvé" });
      }
    });
});

router.get("/contrat/:_id", (req, res) => {
  Contrat.findById({ _id: req.params._id })
    .populate("client")
    .populate("interlocutor")
    .then((data) => {
      console.log("route contrat contrat", data);
      if (data) {
        res.json({ result: true, contrat: data });
      } else {
        res.json({ result: false, error : "Contrat pas trouvé" });
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
  console.log("req body =>",req.body);

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
          marge: req.body.marge,
        });
        newContrat.save().then((newContrat) => {
          Client.updateOne(
            {_id: req.body.client},
            { $push: { contrats: newContrat._id } })
            .then(data => console.log("update client",data)) 
          User.updateOne(
            { token: req.body.token },
            { $push: { contrats: newContrat._id } },
          
          ).then((data) => {
            if (data) {
              console.log("update user", data);
              res.json({ result: true, contrat: newContrat });
            } else {
              res.json({result: false, error: "User pas update"})
            }
          });
        })
    }
  );

// :id correspond à l'ID du contrat
router.put("/addInterlocutor/:id", (req, res) => {
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
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }

  const newInterlocutor = new Interlocutor({
    name: req.body.name,
    firstname: req.body.firstname,
    poste: req.body.poste,
    phone: req.body.phone,
    email: req.body.email,
    client: req.body.client,
  });
  //sauvegarde le nouvel interlocuteur
  newInterlocutor.save().then((data) => {
    // MAJ contrat avec new interloc
    Contrat.updateOne({ _id: req.params.id }, { interlocutor: data._id }).then(
      () => {
        // MAJ client avec new interloc
        Client.updateOne(
          { _id: req.body.client },
          { $push: { interlocutor: data._id } }
        ).then(() => {
          // Info contrat mis à jour avec new interloc
          Contrat.findById({ _id: req.params.id })
            .populate("interlocutor")
            .then((data) => {
              console.log(data);
              if (data) {
                res.json({ result: true, data: data });
              } else {
                res.json({
                  result: false,
                  error: "Client pas update avec le new interloc !",
                });
              }
            });
        });
      }
    );
  });
});

router.put("/updateContrat/:id", (req, res) => {
  console.log("LES DATAS DE BODY UPDATEDATA", req.body);
  Contrat.updateOne(
    { _id: req.params.id },
    {
      type: req.body.type,
      amount: req.body.amount,
      marge: req.body.marge,
      duration: req.body.duration,
      contratStart: req.body.contratStart,
      contratEnd: req.body.contratEnd,
      residualValue: req.body.residualValue,
    }
  ).then(() => {
    Contrat.findById({ _id: req.params.id }).then((data) => {
      if (data) {
        res.json({ result: true, contrat: data });
      } else {
        res.json({ result: false, error: "Contrat pas trouver !" });
      }
    });
  });
});

router.put("/updateLink/:id", (req, res) => {
  console.log("AMIN DIT MOI ????", req.body);
  Contrat.updateOne({ _id: req.params.id }, { links: req.body.links }).then(
    () => {
      Contrat.findById({ _id: req.params.id }).then((data) => {
        console.log("INFO ROUTE LINK =>", data);
        if (data) {
          res.json({ result: true, contrat: data });
        } else {
          res.json({ result: false, error: "Contrat pas trouver !" });
        }
      });
    }
  );
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
