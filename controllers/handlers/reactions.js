const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");

async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    const userEmail = await slackService.getUserEmailById(userId);
    console.log(userEmail);
    console.log(reaction);
    console.log(channelId);
    console.log(messageTs);
    await salesforceService.updateCaseStatus(userEmail, reaction, channelId, messageTs);


}

module.exports = {
    handleReactionToMessage
}