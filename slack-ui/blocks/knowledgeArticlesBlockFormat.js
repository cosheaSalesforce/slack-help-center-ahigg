//The function receives information regarding a single knowledge article, creates a block for a search result and returns to the caller
function createArticlesMsgFormat(title, author, lastModified, link) {
    var linkText = "<" + link + "|" + title + ">";
    var contextTest = author + " • " + lastModified;

    var blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: linkText
            },
            accessory: {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Open",
                    emoji: true
                },
                value: "click_me_123",
                url: link,
                action_id: "button-action"
            }
        },
        {
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: contextTest
                }
            ]
        },
        {
            type: "divider"
        }
    ]
    return blocks;
}


module.exports = {
    createArticlesMsgFormat,
};