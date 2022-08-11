const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {

    app.action("createNewCase", async ({ ack, payload, client, say }) => {
        await ack();
        try {
            caseCreationHandler.showCaseCreationModal(payload, client);
        } catch (error) {
            console.error(error);
        }
    });

}
module.exports = {
    init
};