const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");

async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    const userEmail = await slackService.getUserEmailById(userId);
    const messages = await slackService.getParentMessage(channelId, messageTs);
    console.log(messages);
    // await salesforceService.updateCaseStatus(userEmail, reaction, channelId, messageTs);
}

module.exports = {
    handleReactionToMessage
}