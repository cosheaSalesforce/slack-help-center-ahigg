// slackPost: {
//     channelId (string)
//     threadId (string)
//     messageContent (string)
//     userEmail (string)
//     isEphermal (boolean)
//     showNewCase (boolean)
// }

async function postMessages(app, slackPosts) {
    console.log('postMessages called.');

    for (var i = 0; i < slackPosts.length; i++) {
        try {
            var slackPost = slackPosts[i];
            var blocks = [];
            
            // Post to User?
            if (slackPost.userEmail) {
                try {
                    var user = await app.client.users.lookupByEmail({ email: slackPost.userEmail });
                    blocks.push(getTextBlock('Hey <@' + user.user.id + '>,'));
                } catch (ex) {
                    console.log('Error finding User: ', ex);
                }
            }
        
            // var content = slackPost.messageContent.replace("\\n","\n");
            var content = replaceAll(slackPost.messageContent, "\\n", "\n");
        
        
            // blocks.push(getTextBlock(slackPost.messageContent));
            blocks.push(getTextBlock(content));
        
            if (slackPost.showNewCase) {
                blocks.push(getButtonBlock(slackPost.channelId));
            }

        
            var payload = {};
            payload.channel = slackPost.channelId;
            payload.blocks = blocks;

            if (slackPost.threadId != null) {
                payload.thread_ts = slackPost.threadId;
            }

            if (slackPost.isEphermal != null && slackPost.userEmail != null) {
                var user = await app.client.users.lookupByEmail({ email: slackPost.userEmail });
                payload.user = user.user.id;
            }

            var postMessageResponse;
            if (slackPost.isEphermal) {
                postMessageResponse = await app.client.chat.postEphemeral(payload);
            } else {
                postMessageResponse = await app.client.chat.postMessage(payload);
            }
        } catch (ex) {
            console.log('EXCEPTION: ', ex);
        }
    }
}


function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function getTextBlock(text) {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": text
        }
    };
}

function getButtonBlock(channelId) {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Need more Help?"
        },
        "accessory": {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "Log a Case",
                "emoji": true
            },
            "action_id": "createNewCase",
            "value": channelId,
        }
    };
}

module.exports = {
    postMessages
}