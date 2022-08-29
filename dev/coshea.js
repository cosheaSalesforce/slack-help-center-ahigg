const { App } = require('@slack/bolt');

async function getAppInstance() {
    // return new App({
    //     signingSecret: '8d75199c729b8360e99306385ff0dd3c',
    //     token: 'xoxb-1814240140212-3923315668322-cqdPc4Srej31YbS75rjZWc6k'
    // });
    return new App({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN
    });
}




async function startJob() {
    var app = await getAppInstance();

    // console.log(app);

    var userInfo = await app.client.users.lookupByEmail({
        email: 'coshea@salesforce.com.full'
    });
    console.log(userInfo);
}
startJob();