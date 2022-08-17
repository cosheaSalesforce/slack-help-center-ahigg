// creates a case menu format to select Category-Group and Categories for a view and return it
function createCategoriesSelectionFormat(hcApp, categoriesObj) {

    var optsGroupsAndCategories = []

    for (var i = 0; i < categoriesObj.length; i++) {
        optsGroupsAndCategories.push({
            type: "section",
            text: {
                type: "plain_text",
                text: categoriesObj[i].categoryGroup.Name,
            },
        });
        optsGroupsAndCategories.push({
            type: "input",
            block_id: 'category_group' + i,
            element: {
                type: "static_select",
                placeholder: {
                    type: "plain_text",
                    text: "Select an option..",
                    emoji: true,
                },
                options: optsCatGroup,
                action_id: "category_group_action" + i,
            },
            label: {
                type: "plain_text",
                text: "Category Group",
                emoji: true,
            },
        });
    }






    var optsCatGroup = [];
    var optsCategories = [];

    for (var i = 0; i < categoryGroupNames.length; i++) {
        optsCatGroup.push({
            text: {
                type: "plain_text",
                text: categoryGroupNames[i],
                emoji: true,
            },
            value: categoryGroupNames[i],
        })
    }

    for (var i = 0; i < categoriesNames.length; i++) {
        optsCategories.push({
            text: {
                type: "plain_text",
                text: categoriesNames[i],
                emoji: true,
            },
            value: categoriesNames[i],
        })
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
            text: "Next",
            emoji: true,
        },
        close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true,
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "plain_text",
                    text: "Choose a category group",
                },
            },
            {
                type: "input",
                block_id: 'category_group',
                element: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Choose a Category Group..",
                        emoji: true,
                    },
                    options: optsCatGroup,
                    action_id: "category_group_action",
                },
                label: {
                    type: "plain_text",
                    text: "Category Group",
                    emoji: true,
                },
            },
            {
                type: "section",
                text: {
                    type: "plain_text",
                    text: "Choose relevant categories",
                },
            },
            {
                type: "input",
                block_id: 'categories',
                element: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Choose Categories..",
                        emoji: true,
                    },
                    options: optsCategories,
                    action_id: "categories_action",
                },
                label: {
                    type: "plain_text",
                    text: "Categories",
                    emoji: true,
                },
            },
        ],
    };
}

module.exports = {
    createCategoriesSelectionFormat,
};