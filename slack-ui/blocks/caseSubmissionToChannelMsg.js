/**
 *  * Creates a message format that lets the channel know a new case was submmited.
 */
function createNewCaseMsgFormat(userName, appName, subject, description) {

    var block = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: subject,
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: description,
            }
        },
        {
            type: "context",
            elements: [
                {
                    "type": "mrkdwn",
                    "text": "Last 6 Months • SDO • Access Request"
                }
            ]
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "<@U02JC7UB9FY>"
            }
        }
    ];

    return block;
}


module.exports = {
    createNewCaseMsgFormat,
};