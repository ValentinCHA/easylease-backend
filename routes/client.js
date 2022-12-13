var express = require('express');
var router = express.Router();
const Client = require('../models/client');
const User = require('../models/users');

const { checkBody } = require('../modules/checkBody');

router.post('/test', (req, res) => {
    if (!checkBody(req.body, ['name', 'interlocutor', 'tel', 'adress', 'email', 'NumberOfEmployees', 'ClientBirth', 'chiffre', 'token'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    Client.findOne({ name: req.body.name }).then(data => {
        if (data === null) {
            const newClient = new Client({
                name: req.body.name,
                interlocutor: req.body.interlocutor,
                tel: req.body.tel,
                adress: req.body.adress,
                email: req.body.email,
                NumberOfEmployees: req.body.NumberOfEmployees,
                ClientBirth: req.body.ClientBirth,
                chiffre: req.body.chiffre,

            });
            // Sauvegarder le client créé 
            newClient.save().then(newDoc => {
                // console.log('nouveau client créé',newDoc);
                // Cherche le user grace au token
                User.updateOne({ token: req.body.token },{
                    $push : {clients : newDoc._id}
                })
                    .then(user => {
                        //   ajout du client dans le tableau user

                        console.log('user',user);
                        res.json({ result: true, message: "Bienvenue!" });
                    })
            });
        } else {

            res.json({ result: false, error: 'Client already exists' });
        }
    })
})

router.get('/test/:token', (req, res) => {
    User.findOne({token:req.params.token})
        .populate('clients')
        .then(data => {
            if (data) {
                res.json({ userInfos: data })
            } else {
                res.json({ message: 'rien trouvé' })
            }
        })
})

module.exports = router