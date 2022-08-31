const deflectCaseEphemeralFormat = require("../../slack-ui/blocks/deflectCaseEphemeralFormat");
const slackService = require("../../services/slack.service");
const mixpanelService = require("../../services/mixpanel.service");
const channelMessages = require("../../json/channelMessages");
const messengerHandler = require(("./messenger"));

async function postDeflectionMessage(userEmail, channelId) {

    var channelIdSub = channelId.substring(2, channelId.length - 1);
    var block = await deflectCaseEphemeralFormat.createDeflectionFormat(channelIdSub);
    var app = await slackService.getAppInstance();
    //var userId = await slackService.getUserIdByEmail(userEmail)

    var slackPost = {
        channelId: channelId,
        threadId: null,
        messageContent: channelMessages[channelId],
        userEmail: userEmail,
        isEphermal: true,
        showNewCase: true,
    }
    console.log(slackPost);
    var arrayPosts = [];
    arrayPosts.push(slackPost);


    // await app.client.chat.postEphemeral({
    //     channel: channelIdSub,
    //     user: userId,
    //     text: "Before you create a case, check out this helpful information!",
    //     blocks: block,
    // });

    //logging user's activation of the workflow
    mixpanelService.trackWorkFlowClick(userEmail);
}

function checkWorkflowVariables(userEmail, channelId) {
    const errors = {};
    if (!userEmail.includes("user.email")) {
        errors['user_name'] = 'Please enter a valid email address';
    }
    if (!channelId.includes("channel")) {
        errors['channel_id'] = 'Please enter a valid channel ID';
    }
    return errors;
}



module.exports = {
    postDeflectionMessage,
    checkWorkflowVariables
};