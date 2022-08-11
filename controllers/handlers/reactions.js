const slackService = require("../../services/slack.service");

async function handleReactionToMessage(client, userId, reaction, channelId, messageTs) {
    const app = slackService.getAppInstance();
    console.log(app);
    userInfo  = await app.client.users.profile.get({
        user: userId
    })
    console.log(userInfo);

}

module.exports = {
    handleReactionToMessage
}