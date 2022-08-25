const caseCreationHandler = require("../handlers/caseCreation");
const { subtype } = require('@slack/bolt');

async function init(app) {

    app.message(subtype('bot_message'), async ({ event, logger }) => {
        console.log('managed to listen to a bot_message event');
        try {
            await caseCreationHandler.createHcCaseFromSlack(event, message);
        } catch (error) {
            console.error(error);
        }
    });

}
module.exports = {
    init
};