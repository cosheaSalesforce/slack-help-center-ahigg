const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");

async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    if (reaction == 'registered' || reaction == 'check') {
        const statusToUpdate = (reaction == 'registered') ? 'Working' : 'Closed';
        const userEmail = await slackService.getUserEmailById(userId);
        const parentMessageTs = await slackService.getParentMessageTs(channelId, messageTs);
        await salesforceService.updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs);
    }
    else {
        const message = await slackService.getMessageContent(channelId, messageTs);
        console.log(message);
    }
}

module.exports = {
    handleReactionToMessage
}