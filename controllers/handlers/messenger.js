// slackPosts object breakdown
// - channelId (string)
// - threadId (string)
// - messageContent (string)
// - userEmail (string)
// - isEphermal (boolean)
// - showNewCase (boolean)





async function postMessages(app, slackPosts) {
   

    for( var i = 0; i < slackPosts.length; i++) {
        var slackPost = slackPosts[i];

        var blocks = [];

        // Post to User?
        if(slackPost.userEmail) {
            try {
                var user = await app.client.users.lookupByEmail({ email: slackPost.userEmail });
                blocks.push(getTextBlock('Hey <@' + user.user.id + '>,'));
            } catch(ex) {
                console.log('Error finding User: ' , ex);
            }
            // var user = await app.client.users.lookupByEmail({ email: slackPost.userEmail });
            // payload.user = user.user.id;
            // blocks.push(getTextBlock('Hey <@' + user.user.id + '>,'));
        }
   

        var content = slackPost.messageContent.split("\n").join("\n");
        console.log(slackPost.messageContent);

        await slackPost.messageContent.split("\n").forEach(function(x){
            blocks.push(getTextBlock(x));
        });

        // blocks.push(getTextBlock(slackPost.messageContent));
        // blocks.push(getTextBlock(content));

        if(slackPost.showNewCase) {
            blocks.push(getButtonBlock());
        }

        try {
            var payload = {};
            payload.channel = slackPost.channelId;
            payload.blocks = blocks;

            if(slackPost.threadId != null) {
                payload.thread_ts = slackPost.threadId;
            }

            if(slackPost.isEphermal != null && slackPost.userEmail != null) {
                var user = await app.client.users.lookupByEmail({ email: slackPost.userEmail });
                payload.user = user.user.id;
            }

            if(slackPost.isEphermal) {
                app.client.chat.postEphemeral(payload);
            } else {
                app.client.chat.postMessage(payload);
            }
        } catch(ex) {
            console.log('EXCEPTION: ' , ex);
        }
    }
}

async function postMessage() {

}

async function post() {

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

function getButtonBlock() {
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
            "value": "click_me_123",
            "action_id": "button-action"
        }
    };
}

module.exports = {
    postMessages
}