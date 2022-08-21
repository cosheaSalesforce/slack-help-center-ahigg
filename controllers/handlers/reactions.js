const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");

async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    if (reaction == 'registered' || reaction == 'check') {
        const statusToUpdate = (reaction == 'registered') ? 'Working' : 'Closed';
        const userEmail = await slackService.getUserEmailById(userId);
        const parentMessageTs = await slackService.getParentMessageTs(channelId, messageTs);
        const messageContent = await slackService.getMessageContent(channelId, messageTs);
        const messageOwner = await slackService.getMessageOwner(channelId, messageTs);
        console.log(messageOwner);
        // await salesforceService.updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs, messageContent);
    }
    else {
        console.log('Nothing happened');
    }
}

module.exports = {
    handleReactionToMessage
}