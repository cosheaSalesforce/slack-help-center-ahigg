async function createDeflectionFormat() {

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
            accessory: {
                type: "button",
                action_id: "createNewCase",
                text: {
                    type: "plain_text",
                    text: "New Case",
                    emoji: true
                },
                style: "primary"
            },

        }
    ]
}

module.exports = {
    createDeflectionFormat,
};