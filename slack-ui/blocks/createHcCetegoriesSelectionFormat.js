// creates a case menu format to select Category-Group and Categories for a view and return it
function createCategoriesSelectionFormat(privateMetadata, groupedCategories, categoryGroupsNames) {

    var optsGroupsAndCategories = []
    console.log(categoryGroupsNames);

    for (var x in categoryGroupsNames) {
        var opts = [];

        for (var y = 0; y < groupedCategories.length; y++) {
            opts.push({
                text: {
                    type: "plain_text",
                    text: groupedCategories[y].Name,
                    emoji: true,
                },
                value: groupedCategories[y].Id,
            })
        }
        optsGroupsAndCategories.push({
            type: "input",
            block_id: x,
            label: {
                type: "plain_text",
                text: categoryGroupsNames[x],
            },
            element: {
                action_id: x + "_action",
                type: "static_select",
                placeholder: {
                    type: "plain_text",
                    text: "Select an Option",
                },
                options: opts,
            },
        });
    }
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
            text: "Next",
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