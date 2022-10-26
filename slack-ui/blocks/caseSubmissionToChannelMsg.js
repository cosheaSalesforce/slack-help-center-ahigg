/**
 *  * Creates a message format that lets the channel know a new case was submmited.
 */
function createNewCaseMsgFormat(userID, categoriesToPresentOnChannel, categories, subject, description) {

    var text = "";
    for (var x in categories) {
        for (var i = 0; i < categories[x].length; i++) {
            if (categoriesToPresentOnChannel.includes(categories[x][i].Id))
                text = text + categories[x][i].Name + " • ";
        }
    }
 
    const categoriesNames = text.substring(0, text.length - 2);
    if(categoriesNames.length <= 0) {
        var block = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*" + subject + "*",
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
                    text: "*" + subject + "*",
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