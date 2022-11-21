const { Metadata } = require("jsforce");

// creates a case menu format to select Category-Group and Categories for a view and return it
function createCategoriesSelectionFormat(privateMetadata, queryResult) {

    var optsGroupsAndCategories = []

    for (var x of queryResult) {
        if (x.Type__c == 'Picklist') {
            var opts = []
            for (var j of x.Categories__r.records) {
                opts.push({
                    text: {
                        type: "plain_text",
                        text: j.Name,
                        emoji: true,
                    },
                    value: j.Id + ',' + j.Name,
                })
            }
            optsGroupsAndCategories.push({
                type: "input",
                block_id: x.Id,
                label: {
                    type: "plain_text",
                    text: x.Name,
                },
                element: {
                    action_id: x.Id + "_action",
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select an Option",
                    },
                    options: opts,
                },
            });
        } else {
            optsGroupsAndCategories.push({
                type: "input",
                block_id: x.Id,
                label: {
                    type: "plain_text",
                    text: x.Name,
                },
                element: {
                    action_id: x.Id + "_action",
                    multiline: (x.Type__c == 'Text') ? false : true,
                    type: "plain_text_input",
                    placeholder: {
                        type: "plain_text",
                        text: "Fill your category here",
                    },
                },
            });
        }
    }

    if (privateMetadata.isSubject[privateMetadata.application]) {
        optsGroupsAndCategories.push({
            type: "input",
            block_id: "subject",
            label: {
                type: "plain_text",
                text: "Subject"
            },
            element: {
                type: "plain_text_input",
                action_id: "subject_action",
                placeholder: {
                    type: "plain_text",
                    text: "What do you need help with?"
                }
            }
        });
    }
    if (privateMetadata.isDescription[privateMetadata.application]) {
        optsGroupsAndCategories.push({
            type: "input",
            block_id: "description",
            label: {
                type: "plain_text",
                text: "Description"
            },
            element: {
                type: "plain_text_input",
                action_id: "description_action",
                multiline: true,
                placeholder: {
                    type: "plain_text",
                    text: "Please describe in details what you need help with.."
                }
            }
        });
    }

    return {
        type: "modal",
        callback_id: "new_case",
        private_metadata: JSON.stringify(privateMetadata),
        title: {
            type: "plain_text",
            text: "Contact Support",
            emoji: true,
        },
        submit: {
            type: "plain_text",
            text: "Submit",
            emoji: true,
        },
        close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true,
        },
        blocks: optsGroupsAndCategories,
    };
}

module.exports = {
    createCategoriesSelectionFormat,
};