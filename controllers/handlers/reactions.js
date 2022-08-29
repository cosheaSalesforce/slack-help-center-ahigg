const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");

async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    if (reaction == 'registered' || reaction == 'check') {
        if(userId == slackService.getBotId()) {
            console.log(userId);
            return;
        }
        const statusToUpdate = (reaction == 'registered') ? 'Working' : 'Closed';
        const userEmail = await slackService.getUserEmailById(userId);
        const parentMessageTs = await slackService.getParentMessageTs(channelId, messageTs);
        console.log(parentMessageTs);
        const messageContent = await slackService.getMessageContent(channelId, messageTs);
        const messageOwnerId = await slackService.getMessageOwner(channelId, messageTs);
        const messageOwnerEmail = await slackService.getUserEmailById(messageOwnerId);
        console.log(messageOwnerEmail);
        await salesforceService.updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs, messageContent, messageOwnerEmail);
    }
    else {
        console.log('Nothing happened');
    }
}

async function addReactionToMessage(app, reqBody) {
    console.log('adding a reaction');
    app.client.reactions.add({
        channel: reqBody[0].channelId,
        name: reqBody[0].emoji,
        timestamp: reqBody[0].messageTs
    })

    
}

module.exports = {
    handleReactionToMessage,
    addReactionToMessage
}