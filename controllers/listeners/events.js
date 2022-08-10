const reactionsHandler = require("../handlers/reactions");

async function init(app) {
    app.event('reaction_added', async ({ event, client, context }) => {
        console.log("catch");
        await reactionsHandler.handleReactionToPost();
    });

}
module.exports = {
    init
};