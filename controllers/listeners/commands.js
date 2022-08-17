const search = require("../handlers/search");

async function init(app) {
    app.command("/search-help", async ({ ack, payload, client }) => {
        await ack();
        try {
            console.log("search knowledge articles");
            console.log("payload");
            console.log(payload);
            await search.knowledgeArticlesSearch(payload.text, payload.channel_id, payload.user_name, client);
        //   searchCase.searchBusinessCase(payload, client);
        } catch (error) {
          console.error(error);
        }
    });

}
module.exports = {
    init
};