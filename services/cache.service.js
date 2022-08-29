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


        var location = './json/channelMessages.json';
        fs.exists(location, function(exists) {
            if(!exists) {
                console.log('Error, file does not exist: ' + location);
                return;
            }
            fs.writeFile(location, JSON.stringify(jsonObj), 'utf8', (err, data) => {
                if(err) {
                    console.log(err);
                }
                return;
            });
        });
    } catch(ex) {
        console.log(ex);
        return;
    }

    

}

module.exports = {
    cacheChannelMessages
}