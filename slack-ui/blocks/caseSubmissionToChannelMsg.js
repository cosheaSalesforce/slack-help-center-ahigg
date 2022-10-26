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
    const categoriesNames = "";
    if(text.length != 0) {
        categoriesNames = text.substring(0, text.length - 2);
    }
    
    console.log(categoriesNames);
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
    console.log(block);
    return block;
}


module.exports = {
    createNewCaseMsgFormat,
};