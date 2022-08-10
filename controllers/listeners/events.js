const reactionsHandler = require("../handlers/reactions");

async function init(app) {

    app.event('reaction_added', async ({ event, client, context }) => {
        console.log("catch added");
        await reactionsHandler.handleReactionToPost();
    });

    app.event('reaction_removed', async ({ event, client, context }) => {
        console.log("catch removed");
        await reactionsHandler.handleReactionToPost();
    });

}
module.exports = {
    init
};