/**
 *  * Creates a message format that lets the channel know a new case was submmited.
 */
function createNewCaseMsgFormat(userID, categories, subject, description) {

    var text = "";
    for (var x in categories) {
        for (var i = 0; i < categories[x].length; i++) {
            text = text + categories[x][i].Name + " • ";
        }
    }

    const categoriesNames = text.substring(0, text.length - 2);


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

    return block;
}


module.exports = {
    createNewCaseMsgFormat,
};