const express = require("express");
const handleSlackMessageResponse = require("../handlers/handleSlackMessageResponse");

async function init(app) {
    receiver.router.use(express.json());
    receiver.router.use(express.urlencoded({ extended: true }));

    receiver.router.post('/slack-post', async (req, res) => {
        try {
            // TO:DO Add auth check

            console.log('coshea : /slack-post');


        } catch (error) {
            res.send(error);
        }
    });


}


module.exports = {
    init
};