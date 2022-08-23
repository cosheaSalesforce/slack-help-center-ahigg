const salesforceService = require("../../services/salesforce.service");
const slackService = require("../../services/slack.service");
const createHcAppSelectionHandler = require("..//..//slack-ui/blocks/createHcAppSelectionFormat");
const createHcCatSelectionHandler = require("..//..//slack-ui/blocks/createHcCetegoriesSelectionFormat");
const createCaseSubmissionMsgHandler = require("..//..//slack-ui/blocks/caseSubmissionToChannelMsg");

/**
 * The function creates the initial modal for creating a new case
 */
async function showCaseCreationModal(payload, client, channelId) {
    try {
        console.log("Welcome to the case creation modal!!");
        console.log(channelId);

        var queryResult = await salesforceService.getSlackChannelAndHcApplication(channelId);

        if (queryResult.HCApplication__c == null) {
            var allHcApplications = await salesforceService.getAllHcApplications();
            var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(channelId, queryResult.Id, allHcApplications);
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFormat,
            });
        } else {
            var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);

            var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
            var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);

            var privateMetadata = {
                channelSlackId: channelId,
                slackChannel: queryResult.Id,
                application: queryResult.HCApplication__c,
                categoryGroupIdsMap: CategoryGroupsNames,
                categories: null,
                subject: null,
                description: null,
                state: "categories"
            };

            var viewFormat = createHcCatSelectionHandler.createCategoriesSelectionFormat(privateMetadata, GroupedCategories, CategoryGroupsNames);
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFormat,
            });
        }

    } catch (error) {
        /// mixpanelService.trackErrors(error, "showNewModal", usersEmail);
        console.log(error);
    }
}

async function handleCaseCreationModal(ack, body, client, view) {
    var stateValues = body.view.state.values;
    var currentView = body.view;
    var metaState = JSON.parse(currentView.private_metadata);
    if (metaState.state == "application") {
        var meta = JSON.parse(currentView.private_metadata);
        meta.application = stateValues.application.application_action.selected_option.value;
        meta.state = "categories";
        var queryGroupedCategories = await salesforceService.getGroupedCategories(meta.application);
        var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
        var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);
        meta.categoryGroupIdsMap = CategoryGroupsNames;
        await ack({ response_action: "update", view: createHcCatSelectionHandler.createCategoriesSelectionFormat(meta, GroupedCategories, CategoryGroupsNames) });
    }
    if (metaState.state == "categories") {
        var meta = JSON.parse(currentView.private_metadata);
        meta.description = stateValues.description.description_action.value;
        meta.subject = stateValues.subject.subject_action.value;
        var groupIdToCategory = []; // maps group Ids to the selected category Ids from the user's selection
        for (var x in meta.categoryGroupIdsMap) {
            groupIdToCategory.push(stateValues[x][x + '_action'].selected_option.value);
        }
        meta.categories = groupIdToCategory;
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
    console.log('successfully reached the end of the front-end side for creating a case, hurray!');
    let userID = body.user.id;
    var userInfo = await client.users.info({
        user: body.user.id,
    });
    var usersEmail = await slackService.getUserEmailById(userID);

    var newCaseMsgBlock = createCaseSubmissionMsgHandler.createNewCaseMsgFormat(userInfo.user.name, meta.application, meta.subject, meta.description);
    var postedMessage = await client.chat.postMessage({
        channel: meta.channelSlackId,
        text: "A new case has been submitted:",
        blocks: newCaseMsgBlock,
    })
    salesforceService.createHcCase(
        meta.slackChannel,
        meta.application,
        meta.categories,
        meta.subject,
        meta.description,
        usersEmail,
        postedMessage.ts,
        'Slack',
        true,
    );
}

/**
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and categories values
 */
function createMapCategoryGroupAndCategories(categoriesObj) {
    var GroupedCategories = new Map();
    for (const x of categoriesObj) {
        var catGroup = x.categoryGroup;
        var catGroupCategories = x.groupCategories;
        GroupedCategories.set(catGroup.Id, catGroupCategories);
    }
    return GroupedCategories;
}

/**
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and names as values 
 */
function createMapGroupCategoryIdToName(categoriesObj) {
    //var CategoryGroupsNames = new Map();
    var CategoryGroupsNames = {};
    for (var i = 0; i < categoriesObj.length; i++) {
        var catGroup = categoriesObj[i].categoryGroup;
        CategoryGroupsNames[catGroup.Id] = catGroup.Name;
        //CategoryGroupsNames.set(catGroup.Id, catGroup.Name);
    }
    return CategoryGroupsNames;
}

module.exports = {
    showCaseCreationModal,
    handleCaseCreationModal,
};
