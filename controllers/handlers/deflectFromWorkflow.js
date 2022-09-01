const slackService = require("../../services/slack.service");
const mixpanelService = require("../../services/mixpanel.service");
const channelMessages = require("../../json/channelMessages.json");
const messengerHandler = require(("./messenger"));

/**
 * The function recieves a user's email and a channel's slack ID from the workflow, and sends back 
 * to the user a formatted message based on the channel's IDs
 */
async function postDeflectionMessage(userEmail, channelId) {
    try {
        var channelIdSub = channelId.substring(2, channelId.length - 1);
        var app = await slackService.getAppInstance();

        var slackPost = {
            channelId: channelIdSub,
            threadId: null,
            messageContent: channelMessages[channelIdSub],
            userEmail: userEmail,
            isEphermal: true,
            showNewCase: true,
        }
        var arrayPosts = [];
        arrayPosts.push(slackPost);

        messengerHandler.postMessages(app, arrayPosts);
        //logging user's activation of the workflow
        mixpanelService.trackWorkFlowClick(userEmail);

    } catch (error) {
        console.error(error);
    }
}

/**
 * Checks whether a user's email and channel's ID from the workflow are valid
 */
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