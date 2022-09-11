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

    app.action("button-ack", async ({ ack, body, client, payload, say }) => {
        await ack();
    });

}
module.exports = {
    init
};