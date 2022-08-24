const express = require("express");
const messenger = require("../handlers/messenger");

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



    receiver.router.post('/cache-messages', async (req, res) => {
        try {
            // TO:DO Add auth check

            res.send({ test: 'test' });
        } catch (error) {
            res.send(error);
        }
    });


}


module.exports = {
    init
};