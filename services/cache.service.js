const salesforce = require("./salesforce.service");

async function cacheChannelMessages() {
    // query the Org
    // transform the data
    // save to json

    try {
        console.log('cacheChannelMessages called.');

        var channelMessages = await salesforce.getSlackChannelMessages();
        console.log('channelMessages: ' , channelMessages);
        console.log('channelMessages: ' , channelMessages.length);

    } catch(ex) {
        console.log(ex);
    }

    

}

module.exports = {
    cacheChannelMessages
}