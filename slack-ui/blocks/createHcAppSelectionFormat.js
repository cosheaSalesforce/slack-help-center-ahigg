const { Channel } = require("jsforce");

// creates a case menu format to select HcAppication for a view and return it
function createCaseAppSelectionFormat(channelId) {
    console.log('Testing case creation ui block:')
    // Provide some initial values to this private_metadata object
    var valuesObj = {
        slackChannel: channelId,
        application: null,
        categoryGroupIdsMap: null,
        categories: null,
        subject: null,
        description: null,
        state: "categories"
    };

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
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "Demo Environment",
                            },
                            value: "a008N000000xOo9QAE",
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Innovation Box",
                            },
                            value: "a008N000000xOWeQAM",
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Solutions Central",
                            },
                            value: "a008N000000xORVQA2",
                        },
                    ],
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