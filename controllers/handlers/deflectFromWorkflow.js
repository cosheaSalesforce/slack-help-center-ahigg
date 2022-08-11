const deflectCaseEphemeralFormat = require("../../slack-ui/blocks/deflectCaseEphemeralFormat");
const slackService = require("../../services/slack.service");

async function postDeflectionMessage(username, channelId) {

    var block = await deflectCaseEphemeralFormat.createDeflectionFormat(channelId);
    var app = await slackService.getAppInstance();
    console.log(channelId);

    await app.client.chat.postEphemeral({
        channel: 'C03RZHGJ0R0',
        user: 'U03939T1E8N',
        text: "Before you create a case, check out this helpful information!",
        blocks: block,
    });
}



module.exports = {
    postDeflectionMessage,
};