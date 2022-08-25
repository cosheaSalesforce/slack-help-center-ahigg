const { App, ExpressReceiver } = require('@slack/bolt');
const actions = require('./controllers/listeners/actions');
const events = require('./controllers/listeners/events');
const commands = require('./controllers/listeners/commands');
const views = require('./controllers/listeners/views');
const routes = require('./controllers/listeners/routes');
const messages = require('./controllers/listeners/messages');
const workflows = require('./controllers/workflows/caseDeflection');
const { postMessages } = require('./controllers/handlers/messenger');
const cacher = require('./services/cache.service');

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    receiver
});


(async () => {

    try {
        // Init for listeners
        await actions.init(app);
        await events.init(app);
        await commands.init(app);
        await views.init(app);
        await routes.init(receiver, app);
        await messages.init(app);


        await app.start(process.env.PORT || 3000);

        console.log('⚡️ Bolt app is running!');

        app.step(await workflows.caseCreationWorkflow());

        cacher.cacheChannelMessages();

    } catch (ex) {
        console.log(ex);
    }
})();



