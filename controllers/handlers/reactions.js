const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");

async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    if (reaction == 'registered' || reaction == 'check') {
        const statusToUpdate = (reaction == 'registered') ? 'working' : 'closed';
        const userEmail = await slackService.getUserEmailById(userId);
        const parentMessageTs = await slackService.getParentMessageTs(channelId, messageTs);
        console.log(messageTs);
        console.log(statusToUpdate);
        console.log(parentMessageTs);
        // await salesforceService.updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs);
    }
    else {
        console.log("nothing happened");
    }
}

module.exports = {
    handleReactionToMessage
}