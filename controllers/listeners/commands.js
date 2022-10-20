
const search = require("../handlers/search");
const caseCreationHandler = require("../handlers/caseCreation");

async function init(app) {
    app.command("/search-help", async ({ ack, payload, client }) => {
        await ack();
        try {
            await search.knowledgeArticlesSearch(payload.text, payload.channel_id, payload.user_name, payload.user_id, client);
        } catch (error) {
            console.error(error);
        }
    });

    app.command("/newcase", async ({ ack, payload, client }) => {
        await ack();
        try {
            caseCreationHandler.showCaseCreationModal(payload, client, payload.channel_id);
        } catch (error) {
            console.error(error);
        }
    });

    app.command("/getcases", async ({ ack, payload, client }) => {
        await ack();
        try {
            search.searchRelevantCases(payload, client, payload.channel_id);
        } catch (error) {
            console.error(error);
        }
    });
}

module.exports = {
    init
};