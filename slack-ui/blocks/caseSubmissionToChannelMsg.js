/**
 *  * Creates a message format that lets the channel know a new case was submmited.
 */
function createNewCaseMsgFormat(userID, categoriesToPresentOnChannel, subject, description) {

    var text = "";
    for (var x of categoriesToPresentOnChannel) {
        console.log(x);
        text = text + x + " • ";
    }

    const categoriesNames = text.substring(0, text.length - 2);
    if (categoriesNames.length <= 0) {
        var block = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*" + ((subject) ? subject : '') + "*",
                }
            },

            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: (description) ? description : '',
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "<@" + userID + ">",
                }
            }
        ];
    } else {
        var block = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*" + ((subject) ? subject : '') + "*",
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: (description) ? description : '',
                }
            },
            {
                type: "context",
                elements: [
                    {
                        "type": "mrkdwn",
                        "text": categoriesNames,
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "<@" + userID + ">",
                }
            }
        ];
    }

    return block;
}


module.exports = {
    createNewCaseMsgFormat,
};