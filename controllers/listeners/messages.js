const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {

    app.message('A new case', async ({ body, message, say }) => {
        console.log('managed to listen to a message event');
        await ack();
        try {
            caseCreationHandler.createHcCaseFromSlack(body, message);
        } catch (error) {
            console.error(error);
        }
    });

}
module.exports = {
    init
};