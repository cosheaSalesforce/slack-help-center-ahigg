const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {
    app.command("/newcase", async ({ ack, payload, client }) => {
        await ack();
        try {
            await caseCreationHandler.showCaseCreationModal(payload, client, payload.channel_id);
        } catch (error) {
            console.error(error);
        }
    });
}
module.exports = {
    init
};