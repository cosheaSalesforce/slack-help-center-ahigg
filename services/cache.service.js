const salesforce = require("./salesforce.service");
const fs = require('fs');

const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URL });


async function initRedisClient() {
    await client.connect();
    client.on('error', (err) => console.log('Redis Client Error', err));
}


async function cacheChannelMessages() {
    try {
        var channelMessages = await salesforce.getSlackChannelMessages();
        channelMessages = JSON.parse(channelMessages);

        for (var i = 0; i < channelMessages.length; i++) {
            //console.log(channelMessages[i]);
            await client.set(
                String(channelMessages[i].channelId),
                String(channelMessages[i].messageContent)
            );
        }
    } catch (ex) {
        console.log(ex);
        return;
    }
}


async function getChannelMessage(channelId) {
    try {
        // var tmp = await client.get(channelId);
        var tmp = await client.get("C041C6G6LR4");
        console.log('tmp: ', tmp);
        return tmp;
    } catch (ex) {
        console.log(ex);
        return null;
    }
}


module.exports = {
    initRedisClient,
    cacheChannelMessages,
    getChannelMessage
}