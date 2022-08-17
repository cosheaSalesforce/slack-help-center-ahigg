const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {

    app.action("createNewCase", async ({ ack, body, client, payload, say }) => {
        await ack();
        try {
            caseCreationHandler.showCaseCreationModal(body, client, payload.value);
        } catch (error) {
            console.error(error);
        }
    });

}
module.exports = {
    init
};