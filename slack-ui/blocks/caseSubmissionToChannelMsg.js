/**
 *  * Creates a message format that lets the channel know a new case was submmited.
 */
function createNewCaseMsgFormat(userName, appName, subject, description) {

    var block = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "A new case has been submitted:"
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: 'Created by: ' + userName,
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: 'Related Application: ' + appName,
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: 'Case Subject: ' + subject,
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: 'Related Application: ' + description,
            }
        },
    ];

    return block;
}


module.exports = {
    createNewCaseMsgFormat,
};