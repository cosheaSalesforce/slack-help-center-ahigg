const salesforceService = require("../../services/salesforce.service");
const createHcAppSelectionHandler = require("..//..//slack-ui/blocks/createHcAppSelectionFormat");
const createHcCatSelectionHandler = require("..//..//slack-ui/blocks/createHcCetegoriesSelectionFormat");
/**
 * The function creates the initial modal for creating a new case
 */
async function showCaseCreationModal(payload, client, channelId) {
    try {
        console.log("Welcome to the case creation modal!!");
        console.log(channelId);

        var queryResult = await salesforceService.getSlackChannelAndHcApplication(channelId);
        console.log('1. new case - HcApplication:')

        if (queryResult.HCApplication__c == null) {
            var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat();
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFormat,
            });
        } else {
            var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);
            console.log('2. new case - HcCategoryGroup and Categories:')
            console.log(queryGroupedCategories);
            console.log(JSON.stringify(queryGroupedCategories));
            var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
            console.log("looking at the two maps:");
            console.log(GroupedCategories);
            var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);
            console.log(CategoryGroupsNames);
            console.log();
            var viewFormat = createHcCatSelectionHandler.createCategoriesSelectionFormat(queryResult.HCApplication__c, GroupedCategories, CategoryGroupsNames);
            console.log("looking at the view:");
            console.log(viewFormat);
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFormat,
            });
        }

    } catch (error) {
        // mixpanelService.trackErrors(error, "showNewModal", usersEmail);
    }
}

async function handleCaseCreationModal(ack, body, client, view) {
    var stateValues = body.view.state.values;
    var currentView = body.view;
    var metaState = JSON.parse(currentView.private_metadata);
    if (metaState.state == "application") {
        console.log('2. new case - HcCategoryGroup and Categories:')
        var meta = JSON.parse(currentView.private_metadata);
        meta.application = stateValues.application.application_action.selected_option.value;
        meta.state = "categories";
        console.log(meta);
        // var categoryGroups = await salesforceService.getCategoryGroup(queryResult.HCApplication__c);
        // var groupsList = [];
        // var groupNames = [];
        // var categoriesNames = []
        // for (const group of categoryGroups) {
        //     groupsList.push(group.Id);
        //     groupNames.push(group.Name);
        // }
        // var categories = await salesforceService.getCategories(groupsList);
        // for (const category of categories) {
        //     categoriesNames.push(category.Name);
        // }
        // await ack({ response_action: "update", view: createHcCatSelectionHandler.createCategoriesSelectionFormat(meta, groupNames, categoriesNames) });
    }
    if (metaState.state == "categories") {
        var meta = JSON.parse(currentView.private_metadata);
        meta.categoryGroup = stateValues.category_group.category_group_action.selected_option.value;
        meta.categories = stateValues.categories.categories_action.selected_option.value;
        await ack();
        try {
            createHcCaseFromSlack(body, client, view, meta);
        } catch (error) {
            //mixpanelService.trackErrors(error, "showNewModal", usersEmail);
            console.error(error);
        }
    }
}

/**
 * The function recieves the required details to create a help-center case, creates it and the notifies
 * the user that his case was created
 */
async function createHcCaseFromSlack(body, client, view, meta) {
    let userID = body.user.id;
    // var userInfo = await client.users.info({
    //     user: body.user.id,
    // });
    // var usersEmail = userInfo.user.name + "@salesforce.com";
    var myNewCase = await salesforceService.createHcCase(
        meta.application,
        meta.categoryGroup,
        meta.categories,
        //usersEmail,
    );
    console.log('successfully reached the end of the front-end side for creating a case, hurray!');
    // var url = await salesforceService.getDomain();
    // url = url + "/" + myNewCase.Id;

    // var logo = meta.calculator == "a0109000010yOBfAAM" ? ":salesforce: " : ":mulesoft-logo: ";
    // var txt = logo + "<" + url + "|" + myNewCase.Business_Case_Name__c + ">";

    // // Respond to action with an ephemeral message
    // var ephermalBlock = ephermalMessageFormat.createEphermalMessageBlocks(url, txt, myNewCase.Id, myNewCase.Business_Case_Name__c);
    // await client.chat.postEphemeral({
    //     channel: userID,
    //     user: userID,
    //     text: "Your new Business Case has been created!",
    //     blocks: ephermalBlock,
    // });
    // //logging the creation of a new business case
    // mixpanelService.trackNewBusinessCase(myNewCase.Business_Case_Name__c, usersEmail);
}

/**
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and categories values
 */
function createMapCategoryGroupAndCategories(categoriesObj) {
    var GroupedCategories = new Map();
    console.log('got into the first function');
    for (const x of categoriesObj) {
        console.log(x);
        var catGroup = x.cateGoryGroup;
        console.log(catGroup);
        var catGroupCategories = x.groupCategories;
        console.log(catGroupCategories);
        GroupedCategories.set(catGroup.Id, catGroupCategories);
        console.log(GroupedCategories);
    }
    console.log('got out of the first function');
    return GroupedCategories;
}

/**
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and names as values 
 */
function createMapGroupCategoryIdToName(categoriesObj) {
    console.log('got into the second function');
    var CategoryGroupsNames = new Map();
    for (var i = 0; i < categoriesObj.length; i++) {
        var catGroup = categoriesObj[i].cateGoryGroup;
        CategoryGroupsNames.set(catGroup.Id, catGroup.Name);
    }
    return CategoryGroupsNames;
}

module.exports = {
    showCaseCreationModal,
    handleCaseCreationModal,
};
