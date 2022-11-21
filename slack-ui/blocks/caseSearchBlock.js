//The function receives information regarding a single case, creates a block for a search result and returns to the caller
function createCaseSearchFormat(caseSubject, caseOrigin, caseChannel, link) {
    var linkText = caseSubject ? ("<" + link + "|" + caseSubject + ">") : link;
    var contextTest = caseChannel + " • " + caseOrigin;

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
                action_id: "button-ack"
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
    createCaseSearchFormat,
};