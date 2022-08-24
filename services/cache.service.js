const salesforce = require("./salesforce.service");

async function cacheChannelMessages() {
    // query the Org
    // transform the data
    // save to json

    console.log('cacheChannelMessages called.');

    var channelMessages = await salesforce.getSlackChannelMessages();
    console.log('channelMessages: ' , channelMessages);

}

module.exports = {
    cacheChannelMessages
}