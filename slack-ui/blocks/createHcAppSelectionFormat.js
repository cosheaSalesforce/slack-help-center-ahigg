const { Channel } = require("jsforce");

// creates a case menu format to select HcAppication for a view and return it
function createCaseAppSelectionFormat(allApps, privateMetadata) {

    var opts = [];
    for (var i = 0; i < allApps.length; i++) {
        opts.push({
            text: {
                type: "plain_text",
                text: allApps[i].Name,
                emoji: true,
            },
            value: allApps[i].Id,
        });
        privateMetadata.isSubject[allApps[i].Id] = allApps[i].Use_Subject_Field__c;
        privateMetadata.isDescription[allApps[i].Id] = allApps[i].Use_Description_Field__c;
    }

    let view = {
        type: "modal",
        private_metadata: JSON.stringify(privateMetadata),
        // View identifier
        callback_id: "new_case",
        title: {
            type: "plain_text",
            text: "Contact Support",
            emoji: true,
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Please choose an application for your case.",
                }
            },
            {
                type: "input",
                block_id: "application",
                label: {
                    type: "plain_text",
                    text: "Application",
                },
                element: {
                    action_id: "application_action",
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Choose an Application",
                    },
                    options: opts,
                },
            },
        ],
        submit: {
            type: "plain_text",
            text: "Next",
        },
        close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true,
        },
    };
    return view;
}

module.exports = {
    createCaseAppSelectionFormat,
};