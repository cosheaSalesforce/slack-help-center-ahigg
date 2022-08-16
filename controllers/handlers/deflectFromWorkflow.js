const deflectCaseEphemeralFormat = require("../../slack-ui/blocks/deflectCaseEphemeralFormat");
const slackService = require("../../services/slack.service");

async function postDeflectionMessage(userEmail, channelId) {

    var channelIdSub = channelId.substring(2, channelId.length - 1);
    var block = await deflectCaseEphemeralFormat.createDeflectionFormat(channelIdSub);
    var app = await slackService.getAppInstance();
    var userId = await slackService.getUserIdByEmail(userEmail)
    console.log(userId);

    await app.client.chat.postEphemeral({
        channel: channelIdSub,
        user: userId,
        text: "Before you create a case, check out this helpful information!",
        blocks: block,
    });
}



module.exports = {
    postDeflectionMessage,
};