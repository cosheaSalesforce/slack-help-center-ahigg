const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {

    app.message('A new case has been submitted', async ({ body, message, say }) => {
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