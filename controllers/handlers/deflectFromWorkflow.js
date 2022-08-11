const deflectCaseEphemeralFormat = require("../../slack-ui/blocks/deflectCaseEphemeralFormat");

async function postDeflectionMessage(username, channelId) {

    var block = await deflectCaseEphemeralFormat.createDeflectionFormat();

    await client.chat.postEphemeral({
        channel: channelId,
        user: username,
        text: "Before you create a case check out this helpful information!",
        blocks: block,
    });
}



module.exports = {
    postDeflectionMessage,
};