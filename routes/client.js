var express = require("express");
var router = express.Router();
const Client = require("../models/client");
const User = require("../models/users");
const Interlocutor = require("../models/interlocutor");
const { checkBody } = require("../modules/checkBody");
const { populate } = require("../models/users");

router.get("/allClients", (req, res) => {
  Client.find({})
    .populate("interlocutor")
    .then((data) => {
      if (data) {
        res.json({ result: true, clients: data });
      } else {
        res.json({ result: false, error: "Aucun client trouvé" });
      }
    });
});

router.get('/id/:clientId', (req,res) => {
  console.log("client en qqq");
    Client.findById({ _id : req.params.clientId})
    .populate('contrats')
    .populate({
      path:'interlocutor',
      populate: {
        path:'client',
        populate: {
          path : 'contrats'
        }
    }
    })
    .then(data => {
      if(data) {
        console.log("date",data);
        res.json({result: true, client: data})
      } else {
        res.json({result: false, error: "Aucun client trouvé"})
      }
    })
  });

router.get('/:clientName', (req,res) => {
  Client.findOne({ name : req.params.clientName})
  .populate("interlocutor")
  .then(data => {
    if(data) {
      res.json({result: true, client: data})
    } else {
      res.json({result: false, error: "Aucun client trouvé"})
    }
  })
});

router.post("/uploadClient", async (req, res) => {
  // Vérifie si tous les champs sont remplis et existent
  if (
    !checkBody(req.body, [
      "name",
      "interlocutors",
      "address",
      "numberOfEmployees",
      "chiffreAffaire",
      "token", // Ajout du champ "token"
    ])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }

  // Vérifie l'existence du client
  // let clientData = await Client.findOne({ name: req.body.name });

  // if (clientData === null) {
    // Crée un nouveau client
    const newClient = new Client({
      name: req.body.name,
      address: req.body.address,
      numberOfEmployees: req.body.numberOfEmployees,
      clientBirth: req.body.clientBirth,
      chiffre: req.body.chiffreAffaire,
    });

// Sauvegarde le client créé
let newDoc = await newClient.save();

// Crée un document interlocuteur pour chaque entrée du tableau interlocutors venant du front
req.body.interlocutors.map(async (e) => {
  const newInterlocutor = new Interlocutor({
    client: newDoc._id,
    phone: e.phoneNumber,
    name: e.name,
    firstname: e.firstname,
    email: e.email,
    poste: e.poste,
  });

  // Sauvegarde le nouvel interlocuteur
  let newInterloc = await newInterlocutor.save();

  // Met à jour le client avec le nouvel interlocuteur
  let clientToUpdate = await Client.updateOne(
    {
      _id: newDoc._id,
    },
    {
      $push: { interlocutor: newInterloc._id },
    }
  );
});

// Ajoute le client à l'utilisateur associé au token
await User.updateOne({ token: req.body.token },{$push: { clients: newDoc._id },}
);

// Envoie une réponse positive au client
res.json({ result: true });
  // } else {
  //   // Envoie une réponse négative au client si le client existe déjà
  //   res.json({ result: false, error: "Client existe déja" });
  // }
});

router.post("/addInterlocutor", (req, res) => {
  if (
    !checkBody(req.body, [
      "client",
      "name",
      "firstname",
      "phone",
      "poste",
      "email",
    ])
  ) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }

  Client.findOne({ _id: req.body.client });
  const newInterlocutor = new Interlocutor({
    client: req.body.client,
    phone: req.body.phone,
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    poste: req.body.poste,
  });
  //sauvegarde le nouvel interlocuteur
  newInterlocutor.save().then((data) => {
    Client.updateOne({ _id: req.body.client, },{$push: { interlocutor: data._id }})
    // .populate('interlocutor') //
    .then(() => { Client.findById({ _id: req.body.client })
    .populate('interlocutor').then(data => {
      if (data) {
        res.json({ result : true, data: data});
      } else {
        res.json({result: false, error: 'Client pas update avec le new interloc !'})
      }
    })
    })
  });
});

router.get('/test/:token', (req, res) => {
    User.findOne({ token: req.params.token })
        .populate({
          path: 'clients',
          populate: {path:'contrats'}
        })
        .then(data => {
            if (data) {
                res.json({ result: true, clientsInfos: data})
            } else {
                res.json({ result: false ,message: 'pas trouvé' })
            }
        })
});

router.delete('/delete/:id', (req,res) => {
  Client.deleteOne({_id : req.params.id}).then(data => {
    if (data) {
      res.json({ result: true, client: data });
    } else {
      res.json({ result: false, error: "Client pas trouver !" });
    }
  })
});

router.put("/update/:id", (req, res) => {
  Client.updateOne({ _id: req.params.id },
    {
      name: req.body.name,
      address: req.body.address,
      numberOfEmployees: req.body.numberOfEmployees,
      clientBirth: req.body.clientBirth,
      chiffre: req.body.chiffre,
    }
  ).then(() => {
    Client.findById({ _id: req.params.id }).then((data) => {
      if (data) {
        res.json({ result: true, client: data });
      } else {
        res.json({ result: false, error: "Client pas trouver !" });
      }
    });
  });
});

module.exports = router;