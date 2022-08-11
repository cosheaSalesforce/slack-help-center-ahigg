const deflectCaseEphemeralFormat = require("../../slack-ui/blocks/deflectCaseEphemeralFormat");
const slackService = require("../../services/slack.service");

async function postDeflectionMessage(username, channelId) {

    var block = await deflectCaseEphemeralFormat.createDeflectionFormat();
    var app = await slackService.getAppInstance();
    console.log(app.client);

    await app.client.chat.postEphemeral({
        channel: channelId,
        user: username,
        text: "Before you create a case, check out this helpful information!",
        blocks: block,
    });
}



module.exports = {
    postDeflectionMessage,
};