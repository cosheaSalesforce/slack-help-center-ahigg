const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");


async function handleReactionToMessage(userId, reaction, channelId, messageTs) {
    try {
        if (reaction == 'registered' || reaction == 'check') {
            const statusToUpdate = (reaction == 'registered') ? 'Working' : 'Closed';
            const userEmail = await slackService.getUserEmailById(userId);
            if(userEmail == null) {
                return
            }
            const parentMessageTs = await slackService.getParentMessageTs(channelId, messageTs);
            const messageContent = await slackService.getMessageContent(channelId, messageTs);
            const messageOwnerId = await slackService.getMessageOwner(channelId, messageTs);
            const messageOwnerEmail = await slackService.getUserEmailById(messageOwnerId);
            if (messageOwnerEmail == null) {
                return
            }
            await salesforceService.updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs, messageContent, messageOwnerEmail);
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function addReactionToMessage(app, reqBody) {
    try {
        await app.client.reactions.add({
            channel: reqBody[0].channelId,
            name: reqBody[0].emoji,
            timestamp: reqBody[0].messageTs
        })
    } catch (error) {
        console.error(error);
        return
    }
}

module.exports = {
    handleReactionToMessage,
    addReactionToMessage
}