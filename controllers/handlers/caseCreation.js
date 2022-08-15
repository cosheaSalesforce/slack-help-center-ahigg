const salesforceService = require("../../services/salesforce.service");
const createHcAppSelectionHandler = require("..//..//slack-ui/blocks/createHcAppSelectionFormat");
const createHcCatSelectionHandler = require("..//..//slack-ui/blocks/createHcCategoriesSelectionFormat");
/**
 * The function creates the initial modal for creating a new case
 */
function showCaseCreationModal(payload, client, channelId) {
    try {
        console.log("Welcome to the case creation modal!!");
        console.log(channelId);

        var queryResult = await salesforceService.getSlackChannelAndHcApplication(channelId);
        if (queryResult.HCApplication__c = null) {
            var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat();
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFromat,
            });
        } else {
            var categoryGroups = await salesforceService.getCategoryGroup(queryResult.HCApplication__c);
            var groupsList = [];
            var groupNames = [];
            var categoriesNames = []
            for (const group of categoryGroups) {
                groupsList.push(group.Id);
            }
            var categories = await salesforceService.getCategories(groupsList);
            for (const category of categories) {
                categoriesNames.push(category.Name);
            }
            for (const group of categoryGroups) {
                groupNames.push(group.Name);
            }
            var valuesObj = {
                application: queryResult.HCApplication__c,
                categoryGroup: groupNames,
                categories: categoriesNames,
                state: "categories"
            };
            var viewformat = createHcCatSelectionHandler.createCategoriesSelectionFormat(valuesObj, groupNames, categoriesNames);
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: payload.trigger_id,
                // View payload
                view: viewFromat,
            });
        }

    } catch (error) {
        // mixpanelService.trackErrors(error, "showNewModal", usersEmail);
    }
}

function handleCaseCreationModal(ack, body, client, view) {
    var stateValues = body.view.state.values;
    var currentView = body.view;
    var metaState = JSON.parse(currentView.private_metadata);
    if (metaState.state == "application") {
        var meta = JSON.parse(currentView.private_metadata);
        meta.application = stateValues.application.application_action.selected_option.value;
        meta.state = "categories";
        var categoryGroups = await salesforceService.getCategoryGroup(queryResult.HCApplication__c);
        var groupsList = [];
        var groupNames = [];
        var categoriesNames = []
        for (const group of categoryGroups) {
            groupsList.push(group.Id);
        }
        var categories = await salesforceService.getCategories(groupsList);
        for (const category of categories) {
            categoriesNames.push(category.Name);
        }
        for (const group of categoryGroups) {
            groupNames.push(group.Name);
        }
        await ack({ response_action: "update", view: createHcCatSelectionHandler.createCategoriesSelectionFormat(meta, groupNames, categoriesNames) });
    }
    if (metaState.state == "categories") {
        var meta = JSON.parse(currentView.private_metadata);
        //meta.categoryGroup = stateValues.application.application_action.selected_option.value;
        //meta.categories = stateValues.application.application_action.selected_option.value;
        await ack();
        try {
            //createBusinessCaseFromSlack(body, client, view, meta);
        } catch (error) {
            //mixpanelService.trackErrors(error, "showNewModal", usersEmail);
            console.error(error);
        }
    }
}

module.exports = {
    showCaseCreationModal,
    handleCaseCreationModal,
};
