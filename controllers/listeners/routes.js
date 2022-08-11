const express = require("express");
const messenger = require("../handlers/messenger");

async function init(receiver, app) {
    receiver.router.use(express.json());
    receiver.router.use(express.urlencoded({ extended: true }));

    receiver.router.post('/slack-post', async (req, res) => {
        try {
            // TO:DO Add auth check

            // params required
            // - channelId
            // - threadId ?
            // - messageContent
            // - userEmail ?
            // - isEphermal
            // - showNewCase


            console.log(req.body)



            res.send({ test: 'test' });
        } catch (error) {
            res.send(error);
        }
    });


}


module.exports = {
    init
};