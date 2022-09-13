const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {

    /**
     * The listener is fired when the process to create a new business case is in the making
     */
    app.view("new_case", async ({ ack, body, client, say, view }) => {
        console.log("attemping display a modal");
        caseCreationHandler.handleCaseCreationModal(ack, body, client, view);
    });

}
module.exports = {
    init
};