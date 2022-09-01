const slackService = require("../../services/slack.service");
const salesforceService = require("../../services/salesforce.service");


async function handleReactionToMessage(client, userId, reaction, channelId, messageTs) {
    // console.log(await client.bots.info());
    // console.log(await client.conversations.replies({
    //     channel: channelId,
    //     ts: messageTs
    // }));

    // slackService.getBotId();
    console.log("handling reactions");
    try {
        if (reaction == 'registered' || reaction == 'check') {
            // if(userId == slackService.getBotId()) {
            //     console.log("Bot");
            //     console.log(userId);
            //     return;
            // }
            console.log("hila was here");
            const statusToUpdate = (reaction == 'registered') ? 'Working' : 'Closed';
            const userEmail = await slackService.getUserEmailById(userId);
            if(userEmail == null) {
                return
            }
            const parentMessageTs = await slackService.getParentMessageTs(channelId, messageTs);
            console.log(parentMessageTs);
            const messageContent = await slackService.getMessageContent(channelId, messageTs);
            const messageOwnerId = await slackService.getMessageOwner(channelId, messageTs);
            const messageOwnerEmail = await slackService.getUserEmailById(messageOwnerId);
            if(messageOwnerEmail == null) {
                return
            }
            await salesforceService.updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs, messageContent, messageOwnerEmail);
        }
        else {
            console.log('Nothing happened');
        }
    } catch(error) {
        console.error(error);
        return;
    }
}

async function addReactionToMessage(app, reqBody) {
    console.log('adding a reaction');
    try {
        await app.client.reactions.add({
            channel: reqBody[0].channelId,
            name: reqBody[0].emoji,
            timestamp: reqBody[0].messageTs
        })
    } catch(error) {
        console.error(error);
        return
    }
}

module.exports = {
    handleReactionToMessage,
    addReactionToMessage
}