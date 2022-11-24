const express = require("express");
const messenger = require("../handlers/messenger");

const reactions = require("../handlers/reactions");
const { handleReactionToMessage } = require("../handlers/reactions");
const cacher = require('../../services/cache.service');

async function init(receiver, app) {
    receiver.router.use(express.json());
    receiver.router.use(express.urlencoded({ extended: true }));

    receiver.router.post('/slack-post', async (req, res) => {
        try {
            // TO:DO Add auth check

            // messenger.postMessages(app, req.body);
            // res.send({ test: 'test' });

            if(req.headers.authorization) {
                var authToken = req.headers.authorization.split(' ')[1];
                var decoded = Buffer.from(authToken, 'base64').toString();
    
                var username = decoded.split(':')[0];
                var password = decoded.split(':')[1];
    
                if(username == process.env.AUTH_USERNAME && password == process.env.AUTH_PASSWORD) {
                    messenger.postMessages(app, req.body);
                    res.status(200).send({ success: true, errorMessage: '' });
                } else {
                    res.status(401).send({ success: true, errorMessage: "Authentication failure." });
                }
            } else {
                res.status(401).send({ success: true, errorMessage: "Authentication failure." });
            }

        } catch (error) {
            res.send(error);
        }
    });



    receiver.router.post('/cache-messages', async (req, res) => {
        try {
            // TO:DO Add auth check

            // cacher.cacheChannelMessages();
            // res.send({ test: 'test' });

            if(req.headers.authorization) {
                var authToken = req.headers.authorization.split(' ')[1];
                var decoded = Buffer.from(authToken, 'base64').toString();
    
                var username = decoded.split(':')[0];
                var password = decoded.split(':')[1];
    
                if(username == process.env.AUTH_USERNAME && password == process.env.AUTH_PASSWORD) {
                    cacher.cacheChannelMessages();
                    res.status(200).send({ success: true, errorMessage: '' });
                } else {
                    res.status(401).send({ success: true, errorMessage: "Authentication failure." });
                }
            } else {
                res.status(401).send({ success: true, errorMessage: "Authentication failure." });
            }
            
        } catch (error) {
            res.send(error);
        }
    });

    receiver.router.post('/slack-emoji-update', async(req, res) => {
        try {
            
            //TODO: Add auth
            // reactions.addReactionToMessage(app, req.body);
            // res.status(200).send({'test': 'test'});

            if(req.headers.authorization) {
                var authToken = req.headers.authorization.split(' ')[1];
                var decoded = Buffer.from(authToken, 'base64').toString();
    
                var username = decoded.split(':')[0];
                var password = decoded.split(':')[1];
    
                if(username == process.env.AUTH_USERNAME && password == process.env.AUTH_PASSWORD) {
                    reactions.addReactionToMessage(app, req.body);
                    res.status(200).send({ success: true, errorMessage: '' });
                } else {
                    res.status(401).send({ success: true, errorMessage: "Authentication failure." });
                }
            } else {
                res.status(401).send({ success: true, errorMessage: "Authentication failure." });
            }

        }
        catch (error) {
        res.send(error);
        }
    })
}


module.exports = {
    init
};