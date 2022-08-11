async function createDeflectionFormat(channelId) {

    var block = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Here we put the known issues (SlackMessageResponse object)",
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "And here we place FAQ / Knowledge Articles (SlackMessageResponse object)",
            }
        },
        {
            type: "actions",
            elements: [
                {
                    type: "button",
                    action_id: "createNewCase",
                    text: {
                        type: "plain_text",
                        text: "New Case",
                        emoji: true
                    },
                    style: "primary",
                    value: channelId
                },
            ]
        }
    ]

    return block;
}

module.exports = {
    createDeflectionFormat,
};