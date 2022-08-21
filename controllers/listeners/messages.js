const caseCreationHandler = require("../handlers/caseCreation");
const { subtype } = require('@slack/bolt');

async function init(app) {

    app.message('bot_message', ({ event, logger }) => {
        console.log('managed to listen to a bot_message event');
        await ack();
        try {
            caseCreationHandler.createHcCaseFromSlack(event, message);
        } catch (error) {
            console.error(error);
        }
    });

}
module.exports = {
    init
};