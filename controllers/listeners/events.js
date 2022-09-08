const reactionsHandler = require("../handlers/reactions");

async function init(app) {

    app.event('reaction_added', async ({ event, client, context }) => {
        await reactionsHandler.handleReactionToMessage(event.user, event.reaction, event.item.channel, event.item.ts);
    });

    app.event('reaction_removed', async ({ event, client, context }) => {
        //console.log("catch removed");

    });

}
module.exports = {
    init
};