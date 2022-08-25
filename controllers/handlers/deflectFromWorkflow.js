const deflectCaseEphemeralFormat = require("../../slack-ui/blocks/deflectCaseEphemeralFormat");
const slackService = require("../../services/slack.service");
const mixpanelService = require("../../services/mixpanel.service");

async function postDeflectionMessage(userEmail, channelId) {

    var channelIdSub = channelId.substring(2, channelId.length - 1);
    var block = await deflectCaseEphemeralFormat.createDeflectionFormat(channelIdSub);
    var app = await slackService.getAppInstance();
    var userId = await slackService.getUserIdByEmail(userEmail)

    await app.client.chat.postEphemeral({
        channel: channelIdSub,
        user: userId,
        text: "Before you create a case, check out this helpful information!",
        blocks: block,
    });

    //logging user's activation of the workflow
    mixpanelService.trackWorkFlowClick(userEmail);
}

function checkWorkflowVariables(userEmail, channelId) {
    const errors = {};
    if (!userEmail.includes("user.email")) {
        errors['user_name'] = 'Please enter a valid email address';
    }
    if (!channelId.includes("channel")) {
        errors['user_name'] = 'Please enter a valid channel ID';
    }
    if (Object.entries(errors).length > 0) {
        ack({
            response_action: 'errors',
            errors: errors
        });
    } else {
        ack(); // close this modal - or also possible to set `response_action: 'clear'`
    }
}



module.exports = {
    postDeflectionMessage,
    checkWorkflowVariables
};