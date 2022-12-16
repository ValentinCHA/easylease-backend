var express = require("express");
var router = express.Router();
const Client = require("../models/client");
const User = require("../models/users");
const Interlocutor = require("../models/interlocutor");
const { checkBody } = require("../modules/checkBody");

router.post("/uploadClient", async (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "interlocutors",
      "address",
      "numberOfEmployees",
      "chiffreAffaire",
    ])
  ) 
  {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  } else {
   
    let clientData = await Client.findOne({ name: req.body.name });


    //vérifie l'existence ou non du client
    if (clientData === null) {
      const newClient = new Client({
        name: req.body.name,
        address: req.body.address,
        numberOfEmployees: req.body.numberOfEmployees,
        clientBirth: req.body.clientBirth,
        chiffre: req.body.chiffreAffaire,
      });
      // Sauvegarder le client créé
      let newDoc = await newClient.save()

      // console.log('nouveau client créé',newDoc);
      // crée un document interlocuteur pour chaque entrée du tableau interlocutors venant du front
      req.body.interlocutors.map(async (e) => {
        const newInterlocutor = new Interlocutor({
          client: newDoc._id,
          tel: e.phoneNumber,
          name: req.body.name,
          firstname: e.firstname,
          email: e.email,
          poste: e.poste,
        });
        //sauvegarde le nouvel interlocuteur
        let newInterloc = await newInterlocutor.save();

        let clientToUpdate = await Client.updateOne(
          {
            _id: newDoc._id,
          },
          {
            $push: { interlocutor: newInterloc._id },
          }
        );
      });
      // Cherche le user grace au token

            // Sauvegarder le client créé 
            newClient.save().then(newDoc => {
                // console.log('nouveau client créé',newDoc);
                // Cherche le user grace au token
                // dans le store il existe uniquement que le token de l'utilisateur, l'id est une info trop importante par rapport a la secutité
                User.updateOne({ token: req.body.token }, {
                    $push: { clients: newDoc._id }
                })
                    .then(user => {
                        //   ajout du client dans le tableau user

                        console.log('user', user);
                        res.json({ result: true, message: "Bienvenue!" });
                    })
            });
        } else {

            res.json({ result: false, error: 'Client already exists' });
     await User.updateOne(
        { token: req.body.token },
        {
          $push: { clients: newDoc._id },
        }
      );
    
}

}

});

router.get('/test/:token', (req, res) => {
    User.findOne({ token: req.params.token })
        .populate('clients')
        .then(data => {
            if (data) {
                res.json({ clientsInfos: data.clients, result: true })
            } else {
                res.json({ message: 'not found' })
            }
        })
})

module.exports = router;
