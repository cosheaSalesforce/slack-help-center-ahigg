const salesforce = require("./salesforce.service");
const fs = require('fs');

async function cacheChannelMessages() {
    try {
        var channelMessages = await salesforce.getSlackChannelMessages();
        channelMessages = JSON.parse(channelMessages);

        var jsonObj = {};
        for(var i = 0; i < channelMessages.length; i++) {
           jsonObj[channelMessages[i].channelId] = channelMessages[i].messageContent;
        }

        fs.writeFile('./json/channelMessages.json', JSON.stringify(jsonObj), 'utf8', (err, data) => {
            if(err) {
                console.log(err);
            }
            return;
        });
    } catch(ex) {
        console.log(ex);
        return;
    }

    

}

module.exports = {
    cacheChannelMessages
}