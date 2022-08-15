const { App } = require('@slack/bolt');

async function getAppInstance() {
    return new App({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN
    });
}

async function getUserEmailById(userId) {
    const app = await getAppInstance();
    userInfo  = await app.client.users.profile.get({
        user: userId
    });
    console.log(userInfo);
    userRealName = userInfo.profile.real_name;
    return `${userRealName}@salesforce.com`
}

async function getUserIdByEmail(userEmail) {
    const app = await getAppInstance();
    userInfo = await app.client.users.lookupByEmail({
        email: userEmail
    });
    return userInfo.user.id;
}

async function getParentMessageTs(channelId, ts) {
    try {
        const app = await getAppInstance();
        const result = await app.client.conversations.history({
            channel: channelId,
            latest: ts,
        });
        if (result.messages.length > 0) {
            return result.messages[0].ts;
        }
        return ts;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getAppInstance,
    getUserEmailById,
    getUserIdByEmail,
    getParentMessageTs
}