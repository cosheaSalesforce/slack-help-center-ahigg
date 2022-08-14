const { App } = require('@slack/bolt');

async function getAppInstance() {
    return new App({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN
    });
}

async function getUserEmailById(userId) {
    userInfo  = await app.client.users.profile.get({
        user: userId
    });
    userRealName = userInfo.profile.real_name;
    return `${userRealName}@salesforce.com`
}

async function getUserIdByEmail(userEmail) {
    userInfo = await app.client.users.lookupByEmail({
        email: userEmail
    });
    return userInfo.user.id;
}

module.exports = {
    getAppInstance,
    getUserEmailById,
    getUserIdByEmail
}