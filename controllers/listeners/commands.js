
const search = require("../handlers/search");
const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {
    app.command("/search-help2", async ({ ack, payload, client }) => {
        await ack();
        try {
            console.log("calling search");
            await search.knowledgeArticlesSearch(payload.text, payload.channel_id, payload.user_name, payload.user_id, client);
        } catch (error) {
            console.error(error);
        }
    });

    app.command("/newcase2", async ({ ack, payload, client }) => {
        await ack();
        try {
            caseCreationHandler.showCaseCreationModal(client, payload, payload.channel_id);
        } catch (error) {
            console.error(error);
        }
    });

    app.command("/get-user-cases2", async ({ ack, payload, client }) => {
        await ack();
        try {
            search.searchRelevantCases(client, payload, payload.channel_id);
        } catch (error) {
            console.error(error);
        }
    });
}

module.exports = {
    init
};