/**
 *  * Creates a message format that lets the channel know a new case was submmited.
 */
function createNewCaseMsgFormat(userID, categories, subject, description) {

    var text = "";
    console.log(categories);
    for (const category in categories.values()) {
        text = text + category.Name + " • ";
    }
    var categoriesNames = text.substring(0, text.length - 2);


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