const salesforceService = require("../../services/salesforce.service");
const slackService = require("../../services/slack.service");
const mixpanelService = require("../../services/mixpanel.service");
const createHcAppSelectionHandler = require("..//..//slack-ui/blocks/createHcAppSelectionFormat");
const createHcCatSelectionHandler = require("..//..//slack-ui/blocks/createHcCetegoriesSelectionFormat");
const createCaseSubmissionMsgHandler = require("..//..//slack-ui/blocks/caseSubmissionToChannelMsg");

/**
 * The function creates the initial modal for creating a new case
 */
async function showCaseCreationModal(payload, client, channelId) {
    try {
        var userID = (payload['user_id']) ? payload['user_id'] : ((payload['user']['id']) ? payload['user']['id'] : null);
        var usersEmail = await slackService.getUserEmailById(userID);
        //logging user's request to create a case
        mixpanelService.trackNewCaseClick(usersEmail);

        var queryResult = await salesforceService.getSlackChannelAndHcApplication(channelId);
        if (queryResult.HCApplication__c == null) {
            var allHcApplications = await salesforceService.getAllHcApplications();
            var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(channelId, queryResult.Id, organizeAppsNamesList(allHcApplications));
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFormat,
            });
        }
        // If there's no parent app for the current application, search for child apps of the current app
        else if (queryResult.HCApplication__r.Parent_Application__c == null) {
            var childApplications = await salesforceService.getChildApplications(queryResult.HCApplication__c);
            // if there are no child apps, continue as usual
            if (childApplications == null) {
                var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);
                var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
                var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);
                var privateMetadata = {
                    channelSlackId: channelId,
                    slackChannel: queryResult.Id,
                    application: queryResult.HCApplication__c,
                    categoryGroupIdsMap: CategoryGroupsNames,
                    groupedCategories: GroupedCategories,
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
            } else {
                var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(channelId, queryResult.Id, childApplications);
                const result = await client.views.open({
                    // Pass a valid trigger_id within 3 seconds of receiving it
                    trigger_id: payload.trigger_id,
                    // View payload
                    view: viewFormat,
                });
            }
        } else {
            var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);

            var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
            var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);

            var privateMetadata = {
                channelSlackId: channelId,
                slackChannel: queryResult.Id,
                application: queryResult.HCApplication__c,
                categoryGroupIdsMap: CategoryGroupsNames,
                groupedCategories: GroupedCategories,
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
        console.error(error);
    }
}

/**
 * The function dynamically changes the case creation's modal depending on the given
 * information that is provided from the user, and returns the updated view to the user
 */
async function handleCaseCreationModal(ack, body, client, view) {
    try {
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
            meta.groupedCategories = GroupedCategories;
            await ack({ response_action: "update", view: createHcCatSelectionHandler.createCategoriesSelectionFormat(meta, GroupedCategories, CategoryGroupsNames) });
        }
        if (metaState.state == "categories") {
            var meta = JSON.parse(currentView.private_metadata);
            meta.description = stateValues.description.description_action.value;
            meta.subject = stateValues.subject.subject_action.value;
            var groupIdToCategory = []; // maps group Ids to the selected category Ids from the user's selection
            var categoriesToPresentOnChannel = []
            for (var x in meta.categoryGroupIdsMap) {
                groupIdToCategory.push(stateValues[x][x + '_action'].selected_option.value);
                categoriesToPresentOnChannel.push(stateValues[x][x + '_action'].selected_option.value);
            }
            meta.categories = groupIdToCategory;
            await ack();
            try {
                createHcCaseFromSlack(body, client, view, meta, categoriesToPresentOnChannel);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * The function recieves the required details to create a help-center case, creates it and the notifies
 * the user that a case was created
 */
async function createHcCaseFromSlack(body, client, view, meta, categoriesToPresentOnChannel) {
    try {
        let userID = body.user.id;
        var userInfo = await client.users.info({
            user: body.user.id,
        });
        var usersEmail = await slackService.getUserEmailById(userID);

        var newCaseMsgBlock = createCaseSubmissionMsgHandler.createNewCaseMsgFormat(userID, categoriesToPresentOnChannel, meta.groupedCategories, meta.subject, meta.description);
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
        );
        //logging user's case submission action
        mixpanelService.trackCaseSubmission(usersEmail, meta.subject);

    } catch (error) {
        console.error(error);
    }
}

/**
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and categories values
 */
function createMapCategoryGroupAndCategories(categoriesObj) {
    var GroupedCategories = {}
    for (const x of categoriesObj) {
        var catGroup = x.categoryGroup;
        var catGroupCategories = x.groupCategories;
        GroupedCategories[catGroup.Id] = catGroupCategories;
    }
    return GroupedCategories;
}

/**
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and names as values 
 */
function createMapGroupCategoryIdToName(categoriesObj) {
    var CategoryGroupsNames = {};
    for (var i = 0; i < categoriesObj.length; i++) {
        var catGroup = categoriesObj[i].categoryGroup;
        CategoryGroupsNames[catGroup.Id] = catGroup.Name;
    }
    return CategoryGroupsNames;
}

/**
 * The function receives a list of HC applications, concats the parent app's name to the child's app on the child object and returns the modified list
 */
function organizeAppsNamesList(queryResult) {
    var parentNames = [];
    var editedResults = [];
    for (var i = 0; i < queryResult.length; i++) {
        if (queryResult[i].Parent_Application__c != null) {
            queryResult[i].Name = queryResult[i].Name + " - " + queryResult[i].Parent_Application__r.Name;
            parentNames.push(queryResult[i].Parent_Application__r.Name);
        }
    }
    for (var i = 0; i < queryResult.length; i++) {
        if (!parentNames.includes(queryResult[i].Name)) {
            editedResults.push(queryResult[i]);
        }
    }
    return editedResults;
}
module.exports = {
    showCaseCreationModal,
    handleCaseCreationModal,
};
