const { App, ExpressReceiver } = require('@slack/bolt');
const actions = require('./controllers/listeners/actions');
const events = require('./controllers/listeners/events');
const commands = require('./controllers/listeners/commands');
const views = require('./controllers/listeners/views');
const routes = require('./controllers/listeners/routes');
const workflows = require('./controllers/workflows/caseDeflection');

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


        await app.start(process.env.PORT || 3000);

<<<<<<< HEAD
        console.log('⚡️ Bolt app is running!');
        app.step(await workflows.caseCreationWorkflow());
=======
        console.log('⚡️ Bolt app is runningg!');
>>>>>>> 557596a12fc6486a2c744cdb6321d914ab17ed16
    } catch (ex) {
        console.log(ex);
    }
})();



