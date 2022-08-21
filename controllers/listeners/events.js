const reactionsHandler = require("../handlers/reactions");

async function init(app) {

    app.event('reaction_added', async ({ event, client, context }) => {
        //console.log("catch added");
        //console.log(event);
        //
        await reactionsHandler.handleReactionToMessage(event.user, event.reaction, event.item.channel, event.item.ts);
    });

    app.event('reaction_removed', async ({ event, client, context }) => {
        //console.log("catch removed");

    });

    app.event('message', async ({ event, client, context }) => {
        console.log("catch message");
        console.log(event);
    });

}
module.exports = {
    init
};