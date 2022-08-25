const express = require("express");
const messenger = require("../handlers/messenger");
const reactions = require("../handlers/reactions");

const { handleReactionToMessage } = require("../handlers/reactions");

async function init(receiver, app) {
    receiver.router.use(express.json());
    receiver.router.use(express.urlencoded({ extended: true }));

    receiver.router.post('/slack-post', async (req, res) => {
        try {
            // TO:DO Add auth check

            messenger.postMessages(app, req.body);

            res.send({ test: 'test' });
        } catch (error) {
            res.send(error);
        }
    });

    receiver.router.post('/slack-emoji-update', async(req, res) => {
        try {
            //TODO: Add auth
            console.log("router");
            console.log(req.body);
            reactions.addReactionToMessage(app, req.body);

            res.status(200).send({'test': 'test'});

        }
        catch (error) {
        res.send(error);
        }
    })
}


module.exports = {
    init
};