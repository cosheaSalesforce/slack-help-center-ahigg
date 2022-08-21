const { App } = require('@slack/bolt');

async function getAppInstance() {
    return new App({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN
    });
}

async function getUserEmailById(userId) {
    const app = await getAppInstance();
    userInfo = await app.client.users.info({
        user: userId

    });
    userRealName = userInfo.user.name;
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
        const result = await app.client.conversations.replies({
            channel: channelId,
            ts: ts
            // "limit": 1,
            // "inclusive": true
        });
        return result;
        // if (result.messages.length > 0) {
        //     return result.messages[0].ts;
        // }
        // return ts;
    } catch (error) {
        console.error(error);
    }
}

async function getMessageOwner(channelId, ts) {
    try {
        const app = await getAppInstance();
        const result = await app.client.conversations.replies({
            channel: channelId,
            ts: ts
        });
        
        return result.messages[0].user;
    } catch (error) {
        console.error(error);
    }

}

async function getMessageContent(channelId, ts) {
    try {
        const app = await getAppInstance();
        const result = await app.client.conversations.replies({
            channel: channelId,
            ts: ts,
        });

        var messageContent = '';
        for(let i in result.messages) {
            if (result.messages[i].ts == ts) {
                messageContent = result.messages[i].text;
                return messageContent;
            }
        }
        return messageContent;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getAppInstance,
    getUserEmailById,
    getUserIdByEmail,
    getParentMessageTs,
    getMessageContent,
    getMessageOwner
}