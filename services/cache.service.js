const salesforce = require("./salesforce.service");

async function cacheChannelMessages() {
    // query the Org
    // transform the data
    // save to json

    try {
        console.log('cacheChannelMessages called.');

        var channelMessages = await salesforce.getSlackChannelMessages();
        channelMessages = JSON.parse(channelMessages);

        for(var i = 0; i < channelMessages.length; i++) {
            console.log(channelMessages[i].channelId);
        }

    } catch(ex) {
        console.log(ex);
    }

    

}

module.exports = {
    cacheChannelMessages
}