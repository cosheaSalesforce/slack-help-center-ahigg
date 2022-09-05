const { Channel } = require("jsforce");

// creates a case menu format to select HcAppication for a view and return it
function createCaseAppSelectionFormat(slackId, channelId, allApps) {
    // Provide some initial values to this private_metadata object
    var valuesObj = {
        channelSlackId: slackId,
        slackChannel: channelId,
        application: null,
        categoryGroupIdsMap: null,
        categories: null,
        subject: null,
        description: null,
        state: "application"
    };

    var opts = [];
    for (var i = 0; i < allApps.length; i++) {
        opts.push({
            text: {
                type: "plain_text",
                text: allApps[i].Name,
                emoji: true,
            },
            value: allApps[i].Id,
        })
    }

    let view = {
        type: "modal",
        private_metadata: JSON.stringify(valuesObj),
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