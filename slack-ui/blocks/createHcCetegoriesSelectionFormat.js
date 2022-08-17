// creates a case menu format to select Category-Group and Categories for a view and return it
function createCategoriesSelectionFormat(hcApp, groupedCategories, categoryGroupsNames) {

    var privateMetadata = {
        application: queryResult.HCApplication__c,
        categoryGroupIdsMap: categoryGroupsNames,
        categories: null,
        state: "categories"
    };

    var optsGroupsAndCategories = []

    for (const x of categoryGroupsNames.keys()) {
        var opts = [];
        optsGroupsAndCategories.push({
            type: "section",
            text: {
                type: "plain_text",
                text: categoryGroupsNames.get(x),
            },
        });

        for (const y of groupedCategories.get(x)) {
            opts.push({
                text: {
                    type: "plain_text",
                    text: y.Name,
                    emoji: true,
                },
                value: y.Id,
            })
        }
        optsGroupsAndCategories.push({
            type: "input",
            block_id: x,
            label: {
                type: "plain_text",
                text: "Category",
            },
            element: {
                action_id: x + "_action",
                type: "static_select",
                placeholder: {
                    type: "plain_text",
                    text: "Choose a Category",
                },
                options: opts,
            },
        });
    }

    optsGroupsAndCategories.push({
        type: "input",
        block_id: "description",
        label: {
            type: "plain_text",
            text: "Label of input"
        },
        element: {
            type: "plain_text_input",
            action_id: "description_action",
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