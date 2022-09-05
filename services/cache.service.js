const salesforce = require("./salesforce.service");
const fs = require('fs');

const redis = require("redis");


async function cacheChannelMessages() {
    try {
        console.log('cacheChannelMessages called.');
        var channelMessages = await salesforce.getSlackChannelMessages();
        channelMessages = JSON.parse(channelMessages);

        var jsonObj = {};
        for(var i = 0; i < channelMessages.length; i++) {
           jsonObj[channelMessages[i].channelId] = channelMessages[i].messageContent;
        }

        console.log('jsonObj: ' , jsonObj);


        // var location = './json/channelMessages.json';
        // fs.exists(location, function(exists) {
        //     if(!exists) {
        //         console.log('Error, file does not exist: ' + location);
        //         return;
        //     }
        //     fs.writeFile(location, JSON.stringify(jsonObj), 'utf8', (err, data) => {
        //         if(err) {
        //             console.log(err);
        //         }
        //         console.log('Updated channelMessages.json: ' , data);
        //         return;
        //     });
        // });




        console.log('DOING THE REDIS STUFF!');
        const client = redis.createClient({ url: process.env.REDIS_URL });
        client.on('error', (err) => console.log('Redis Client Error', err));

        await client.connect();
        // for(var key in jsonObj) {
        //     await client.set(key, jsonObj[key]);
        // }
        console.log('KEYS HAVE BEEN SET');

    } catch(ex) {
        console.log(ex);
        return;
    }

    

}

module.exports = {
    cacheChannelMessages
}