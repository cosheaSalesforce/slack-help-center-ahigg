const slackService = require("../../services/slack.service");

async function handleReactionToMessage(client, userId, reaction, channelId, messageTs) {
    const app = await slackService.getAppInstance();
    userInfo  = await app.client.users.profile.get({
        user: userId
    })
    console.log(userInfo);

}

module.exports = {
    handleReactionToMessage
}