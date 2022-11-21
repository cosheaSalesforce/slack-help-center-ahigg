const salesforceService = require("../../services/salesforce.service");
const slackService = require("../../services/slack.service");
const mixpanelService = require("../../services/mixpanel.service");
const createHcAppSelectionHandler = require("..//..//slack-ui/blocks/createHcAppSelectionFormat");
const createHcCatSelectionHandler = require("..//..//slack-ui/blocks/createHcCetegoriesSelectionFormat");
const createCaseSubmissionMsgHandler = require("..//..//slack-ui/blocks/caseSubmissionToChannelMsg");

/**
 * The function creates the initial modal for creating a new case
 */
async function showCaseCreationModal(client, payload, channelId) {
    try {
        var userID = (payload['user_id']) ? payload['user_id'] : ((payload['user']['id']) ? payload['user']['id'] : null);
        var usersEmail = await slackService.getUserEmailById(userID);
        //logging user's request to create a case
        mixpanelService.trackNewCaseClick(usersEmail);

        var queryResult = await salesforceService.getSlackChannelAndHcApplication(channelId);
        if (queryResult.HCApplication__c == null) {
            var allHcApplications = await salesforceService.getAllHcApplications();
            var appsForPresentation = organizeAppsNamesList(allHcApplications);
            var privateMetadata = generatePrivateMetadata(channelId, queryResult.Id, null, null, null, null, null, null, null, "application");
            var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(appsForPresentation, privateMetadata);
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFormat,
            });
        }
        // If there's no parent app for the current application, search for child apps of the current app
        else if (queryResult.HCApplication__r?.Parent_Application__c == null) {
            var childApplications = await salesforceService.getChildApplications(queryResult.HCApplication__c);
            // if there are no child apps, continue as usual
            if (childApplications == null | childApplications.length == 0) {
                handleGroupsAndCategoriesModal(channelId, queryResult, client, payload);
            } else {
                var privateMetadata = generatePrivateMetadata(channelId, queryResult.Id, null, null, null, null, null, null, null, "application");
                var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(childApplications, privateMetadata);
                const result = await client.views.open({
                    // Pass a valid trigger_id within 3 seconds of receiving it
                    trigger_id: payload.trigger_id,
                    // View payload
                    view: viewFormat,
                });
            }
        } else {
            handleGroupsAndCategoriesModal(channelId, queryResult, client, payload);
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
            //var CategoryGroupsTypes = createMapGroupCategoryIdToType(queryGroupedCategories);
            meta.groupsQuery = queryGroupedCategories;
            await ack({ response_action: "update", view: createHcCatSelectionHandler.createCategoriesSelectionFormat(meta, queryGroupedCategories) });
        }
        if (metaState.state == "categories") {
            var meta = JSON.parse(currentView.private_metadata);
            if (meta.isDescription[meta.application]) {
                meta.description = stateValues.description.description_action.value;
            }
            if (meta.isSubject[meta.application]) {
                meta.subject = stateValues.subject.subject_action.value;
            }
            var allCategories = [];
            var categoriesToPresentOnChannel = []
            for (var x of meta.groupsQuery) {
                console.log(x);
                if (x.Type__c == 'Picklist') {
                    console.log('inside the x.type check:');
                    console.log(stateValues[x][x + '_action']);
                    allCategories.push(stateValues[x][x + '_action'].selected_option.value);
                    categoriesToPresentOnChannel.push(stateValues[x][x + '_action'].selected_option.value);
                } else {
                    //console.log(stateValues[x][x + '_action'].value);
                    allCategories.push(stateValues[x][x + '_action'].value);
                    categoriesToPresentOnChannel.push(stateValues[x][x + '_action'].value);
                }
            }
            meta.categories = allCategories;
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

        var newCaseMsgBlock = createCaseSubmissionMsgHandler.createNewCaseMsgFormat(userID, categoriesToPresentOnChannel, meta.categories, meta.subject, meta.description);
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
 * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and groups types as values 
 */
function createMapGroupCategoryIdToType(categoriesObj) {
    var CategoryGroupsTypes = {};
    for (var i of categoriesObj) {
        CategoryGroupsTypes[i.Id] = i.Type__c;
    }
    return CategoryGroupsTypes;
}

/**
 * The function receives a list of HC applications, concats the parent app's name to the child's app on the child object and returns the modified list
 */
function organizeAppsNamesList(queryResult) {
    var parentNames = [];
    var editedResults = [];
    for (var i = 0; i < queryResult.length; i++) {
        if (queryResult[i].Parent_Application__c != null) {
            queryResult[i].Name = queryResult[i].Parent_Application__r.Name + " - " + queryResult[i].Name;
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

/**
 * The function receives the query's results that contains a slack channel and application's IDs, and handles the creation of the 
 * modal that asks the user to pick categories from the categories groups
 */
async function handleGroupsAndCategoriesModal(channelId, queryResult, client, payload) {
    var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);
    //var CategoryGroupsTypes = createMapGroupCategoryIdToType(queryGroupedCategories);
    isSubj = {};
    isDesc = {};
    isSubj[queryResult.HCApplication__c] = queryResult.HCApplication__r.Use_Subject_Field__c;
    isDesc[queryResult.HCApplication__c] = queryResult.HCApplication__r.Use_Description_Field__c;
    var privateMetadata = generatePrivateMetadata(channelId, queryResult.Id, queryResult.HCApplication__c, queryGroupedCategories, null, null, null, isSubj, isDesc, "categories");
    var viewFormat = createHcCatSelectionHandler.createCategoriesSelectionFormat(privateMetadata, queryGroupedCategories);
    const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: payload.trigger_id,
        // View payload
        view: viewFormat,
    });
}

/**
 * The function generates the private metadata that is sent between the modals windows creation process
 */
function generatePrivateMetadata(slackChannelId, orgSlackChannelId, applicationId, queriedGroups, groupedCategories, subj, desc, isSubj, isDesc, state) {
    var privateMetadata = {
        channelSlackId: slackChannelId,
        slackChannel: orgSlackChannelId,
        application: applicationId,
        groupsQuery: queriedGroups,
        categories: groupedCategories,
        subject: subj,
        description: desc,
        isSubject: isSubj ? isSubj : {},
        isDescription: isDesc ? isDesc : {},
        state: state
    };
    return privateMetadata;
}

module.exports = {
    showCaseCreationModal,
    handleCaseCreationModal,
};
