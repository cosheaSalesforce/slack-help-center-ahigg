const salesforce = require("./salesforce.service");
const fs = require('fs');

const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URL });


async function cacheChannelMessages() {
    try {
        console.log('cacheChannelMessages called.');
        var channelMessages = await salesforce.getSlackChannelMessages();
        channelMessages = JSON.parse(channelMessages);

        // const client = redis.createClient({ url: process.env.REDIS_URL });
        client.on('error', (err) => console.log('Redis Client Error', err));

        await client.connect();
        for(var i = 0; i < channelMessages.length; i++) {
            await client.set(
                String(channelMessages[i].channelId), 
                String(channelMessages[i].messageContent)
            );
        }
    } catch(ex) {
        console.log(ex);
        return;
    }
}



async function getChannelMessage(channelId) {
    // await client.connect();
    var tmp = await client.get(channelId);
    return tmp;
}

module.exports = {
    cacheChannelMessages,
    getChannelMessage
}