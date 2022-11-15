const salesforceService = require('../services/salesforce.service');

async function toTest() {
    // var myCases = await salesforceService.getBusinessCases('coshea@salesforce.com', 20);
    // var myCases = await salesforceService.serachBusinessCase('hilabyosef@gmail.com', 'Test');
    // coshea@salesforce.com.invalid
    // var result = await salesforceService.createBusinessCase('test creating bc through slack', 'a0109000010yOBfAAM', 'Education', 'B2B', 'hbenyosef@salesforce.com');
    // var result = await salesforceService.getBusinessCaseById('a025r000001yw9ZAAQ');
    var result = await salesforceService.doLogin();
    // console.log(result.keyPrefix);
    console.log(result);
    // var result = await salesforceService.getDoamin();
    // console.log(result);
}

toTest();





//APEX CODE FOR GROUPS AND CATEGORIES:
// @RestResource(urlMapping='/hcsGroupedCategories/*')
// global with sharing class hcsCategoriesAndGroup {
//   /**
//    * The function receives HcApplication's ID and returns an object which holds
//    * all the category options, as well as the category group's name, that match the given application
//    */
//   @HttpGet
//   global static List<hcsCategoryGroupAndCategories> hcsCategoriesAndGroup() {
//     try {
//       RestRequest request = RestContext.request;
//       String hcApplicationId = request.requestURI.substring(
//         request.requestURI.lastIndexOf('/') + 1
//       );

//       Map<String, List<HC_Category__c>> groupIdToCategories = new Map<String, List<HC_Category__c>>();
//       Map<String, HC_Category_Group__c> groupIdToGroup = new Map<String, HC_Category_Group__c>();
//       List<hcsCategoryGroupAndCategories> categoryGroupsAndCategories = new List<hcsCategoryGroupAndCategories>();

//       List<HC_Category_Group__c> catGroups = [
//         SELECT Id, Name, Order__c, Type__c
//         FROM HC_Category_Group__c
//         WHERE HC_Application__c = :hcApplicationId
//       ];
//       //if the list is empty, we return an empty list, indicating that there are no category groups for the given HcApplication
//       if (catGroups.isEmpty()) {
//         return categoryGroupsAndCategories;
//       }
//       for (HC_Category_Group__c catGroup : catGroups) {
//         groupIdToGroup.put(catGroup.Id, catGroup);
//       }

//       List<HC_Category__c> categories = [
//         SELECT Id, Name, Category_Group__c
//         FROM HC_Category__c
//         WHERE Category_Group__c IN :getGroupIds(catGroups)
//       ];
//       //we map each category group to all of its categories
//       for (HC_Category__c cat : categories) {
//         if (groupIdToCategories.containsKey(cat.Category_Group__c)) {
//           groupIdToCategories.get(cat.Category_Group__c).add(cat);
//         } else {
//           List<HC_Category__c> temp = new List<HC_Category__c>();
//           temp.add(cat);
//           groupIdToCategories.put(cat.Category_Group__c, temp);
//         }
//       }
//       //only groups that had categories would've been inserted in the former loop.
//       //Therefore, we'll iterate the remaining groups and add those whos' type is not picklist
//       for (String Id : groupIdToGroup.keySet()) {
//         if (
//           (!groupIdToCategories.containsKey(Id)) &&
//           groupIdToGroup.get(Id).Type__c != 'Picklist'
//         ) {
//           // The empty list will match groups that aren't of type 'picklist'
//           groupIdToCategories.put(Id, new List<HC_Category__c>());
//         }
//       }

//       //after the mapping process is complete, we create the list of hcsCategoryGroupAndCategories objects
//       for (String groupId : groupIdToCategories.keySet()) {
//         List<HC_Category__c> temp = groupIdToCategories.get(groupId);
//         HC_Category_Group__c catGroup = groupIdToGroup.get(groupId);
//         hcsCategoryGroupAndCategories groupedCategories = new hcsCategoryGroupAndCategories(
//           catGroup,
//           temp
//         );
//         categoryGroupsAndCategories.add(groupedCategories);
//       }
//       return categoryGroupsAndCategories;
//     } catch (Exception e) {
//       System.debug(e);
//       throw e;
//     }
//   }

//   private static List<String> getGroupIds(
//     List<HC_Category_Group__c> categoryGroups
//   ) {
//     List<String> groupIds = new List<String>();
//     for (HC_Category_Group__c catGroup : categoryGroups) {
//       groupIds.add(catGroup.Id);
//     }
//     return groupIds;
//   }

//   global class hcsCategoryGroupAndCategories {
//     public HC_Category_Group__c categoryGroup { get; set; } // the category group of the matching categories
//     public List<HC_Category__c> groupCategories { get; private set; } // Array of categories that match the given category group

//     // hcsCategoryGroupAndCategories constructor.
//     // Accepts a HC_Category_Group__c record and instantiates variables
//     global hcsCategoryGroupAndCategories(HC_Category_Group__c categoryGroup) {
//       this.categoryGroup = categoryGroup;
//       this.groupCategories = new List<HC_Category__c>();
//     }

//     // hcsCategoryGroupAndCategories constructor.
//     // Accepts a HC_Category_Group__c record, a list of HC_Category__c and instantiates variables
//     global hcsCategoryGroupAndCategories(
//       HC_Category_Group__c categoryGroup,
//       List<HC_Category__c> groupCategories
//     ) {
//       this.categoryGroup = categoryGroup;
//       this.groupCategories = groupCategories;
//     }
//   }
// }


//CASE CREATION OLD CODE:
// const salesforceService = require("../../services/salesforce.service");
// const slackService = require("../../services/slack.service");
// const mixpanelService = require("../../services/mixpanel.service");
// const createHcAppSelectionHandler = require("..//..//slack-ui/blocks/createHcAppSelectionFormat");
// const createHcCatSelectionHandler = require("..//..//slack-ui/blocks/createHcCetegoriesSelectionFormat");
// const createCaseSubmissionMsgHandler = require("..//..//slack-ui/blocks/caseSubmissionToChannelMsg");

// /**
//  * The function creates the initial modal for creating a new case
//  */
// async function showCaseCreationModal(client, payload, channelId) {
//     try {
//         var userID = (payload['user_id']) ? payload['user_id'] : ((payload['user']['id']) ? payload['user']['id'] : null);
//         var usersEmail = await slackService.getUserEmailById(userID);
//         //logging user's request to create a case
//         mixpanelService.trackNewCaseClick(usersEmail);

//         var queryResult = await salesforceService.getSlackChannelAndHcApplication(channelId);
//         if (queryResult.HCApplication__c == null) {
//             var allHcApplications = await salesforceService.getAllHcApplications();
//             var appsForPresentation = organizeAppsNamesList(allHcApplications);
//             var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(channelId, queryResult.Id, appsForPresentation);
//             console.log(viewFormat);
//             const result = await client.views.open({
//                 // Pass a valid trigger_id within 3 seconds of receiving it
//                 trigger_id: payload.trigger_id,
//                 // View payload
//                 view: viewFormat,
//             });
//         }
//         // If there's no parent app for the current application, search for child apps of the current app
//         else if (queryResult.HCApplication__r?.Parent_Application__c == null) {
//             var childApplications = await salesforceService.getChildApplications(queryResult.HCApplication__c);
//             // if there are no child apps, continue as usual
//             if (childApplications == null | childApplications.length == 0) {
//                 var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);
//                 var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
//                 var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);
//                 var privateMetadata = {
//                     channelSlackId: channelId,
//                     slackChannel: queryResult.Id,
//                     application: queryResult.HCApplication__c,
//                     categoryGroupIdsMap: CategoryGroupsNames,
//                     groupedCategories: GroupedCategories,
//                     categories: null,
//                     subject: null,
//                     description: null,
//                     isSubject: {},
//                     isDescription: {},
//                     state: "categories"
//                 };
//                 privateMetadata.isSubject[privateMetadata.application] = queryResult.HCApplication__r.Use_Subject_Field__c;
//                 privateMetadata.isDescription[privateMetadata.application] = queryResult.HCApplication__r.Use_Description_Field__c;
//                 var viewFormat = createHcCatSelectionHandler.createCategoriesSelectionFormat(privateMetadata, GroupedCategories, CategoryGroupsNames);
//                 const result = await client.views.open({
//                     // Pass a valid trigger_id within 3 seconds of receiving it
//                     trigger_id: payload.trigger_id,
//                     // View payload
//                     view: viewFormat,
//                 });
//             } else {
//                 var viewFormat = createHcAppSelectionHandler.createCaseAppSelectionFormat(channelId, queryResult.Id, childApplications);
//                 const result = await client.views.open({
//                     // Pass a valid trigger_id within 3 seconds of receiving it
//                     trigger_id: payload.trigger_id,
//                     // View payload
//                     view: viewFormat,
//                 });
//             }
//         } else {
//             var queryGroupedCategories = await salesforceService.getGroupedCategories(queryResult.HCApplication__c);

//             var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
//             var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);

//             var privateMetadata = {
//                 channelSlackId: channelId,
//                 slackChannel: queryResult.Id,
//                 application: queryResult.HCApplication__c,
//                 categoryGroupIdsMap: CategoryGroupsNames,
//                 groupedCategories: GroupedCategories,
//                 categories: null,
//                 subject: null,
//                 description: null,
//                 isSubject: {},
//                 isDescription: {},
//                 state: "categories"
//             };
//             privateMetadata.isSubject[privateMetadata.application] = queryResult.HCApplication__r.Use_Subject_Field__c;
//             privateMetadata.isDescription[privateMetadata.application] = queryResult.HCApplication__r.Use_Description_Field__c;
//             var viewFormat = createHcCatSelectionHandler.createCategoriesSelectionFormat(privateMetadata, GroupedCategories, CategoryGroupsNames);
//             const result = await client.views.open({
//                 // Pass a valid trigger_id within 3 seconds of receiving it
//                 trigger_id: payload.trigger_id,
//                 // View payload
//                 view: viewFormat,
//             });
//         }

//     } catch (error) {
//         /// mixpanelService.trackErrors(error, "showNewModal", usersEmail);
//         console.error(error);
//     }
// }

// /**
//  * The function dynamically changes the case creation's modal depending on the given
//  * information that is provided from the user, and returns the updated view to the user
//  */
// async function handleCaseCreationModal(ack, body, client, view) {
//     try {
//         var stateValues = body.view.state.values;
//         var currentView = body.view;
//         var metaState = JSON.parse(currentView.private_metadata);
//         if (metaState.state == "application") {
//             var meta = JSON.parse(currentView.private_metadata);
//             meta.application = stateValues.application.application_action.selected_option.value;
//             meta.state = "categories";
//             var queryGroupedCategories = await salesforceService.getGroupedCategories(meta.application);
//             var GroupedCategories = createMapCategoryGroupAndCategories(queryGroupedCategories);
//             var CategoryGroupsNames = createMapGroupCategoryIdToName(queryGroupedCategories);
//             meta.categoryGroupIdsMap = CategoryGroupsNames;
//             meta.groupedCategories = GroupedCategories;
//             await ack({ response_action: "update", view: createHcCatSelectionHandler.createCategoriesSelectionFormat(meta, GroupedCategories, CategoryGroupsNames) });
//         }
//         if (metaState.state == "categories") {
//             var meta = JSON.parse(currentView.private_metadata);
//             if (meta.isDescription[meta.application]) {
//                 meta.description = stateValues.description.description_action.value;
//             }
//             if (meta.isSubject[meta.application]) {
//                 meta.subject = stateValues.subject.subject_action.value;
//             }
//             var groupIdToCategory = []; // maps group Ids to the selected category Ids from the user's selection
//             var categoriesToPresentOnChannel = []
//             for (var x in meta.categoryGroupIdsMap) {
//                 groupIdToCategory.push(stateValues[x][x + '_action'].selected_option.value);
//                 categoriesToPresentOnChannel.push(stateValues[x][x + '_action'].selected_option.value);
//             }
//             meta.categories = groupIdToCategory;
//             await ack();
//             try {
//                 createHcCaseFromSlack(body, client, view, meta, categoriesToPresentOnChannel);
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// /**
//  * The function recieves the required details to create a help-center case, creates it and the notifies
//  * the user that a case was created
//  */
// async function createHcCaseFromSlack(body, client, view, meta, categoriesToPresentOnChannel) {
//     try {
//         let userID = body.user.id;
//         var userInfo = await client.users.info({
//             user: body.user.id,
//         });
//         var usersEmail = await slackService.getUserEmailById(userID);

//         var newCaseMsgBlock = createCaseSubmissionMsgHandler.createNewCaseMsgFormat(userID, categoriesToPresentOnChannel, meta.groupedCategories, meta.subject, meta.description);
//         var postedMessage = await client.chat.postMessage({
//             channel: meta.channelSlackId,
//             text: "A new case has been submitted:",
//             blocks: newCaseMsgBlock,
//         })
//         salesforceService.createHcCase(
//             meta.slackChannel,
//             meta.application,
//             meta.categories,
//             meta.subject,
//             meta.description,
//             usersEmail,
//             postedMessage.ts,
//         );
//         //logging user's case submission action
//         mixpanelService.trackCaseSubmission(usersEmail, meta.subject);

//     } catch (error) {
//         console.error(error);
//     }
// }

// /**
//  * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and categories values
//  */
// function createMapCategoryGroupAndCategories(categoriesObj) {
//     var GroupedCategories = {}
//     for (const x of categoriesObj) {
//         var catGroup = x.categoryGroup;
//         var catGroupCategories = x.groupCategories;
//         GroupedCategories[catGroup.Id] = catGroupCategories;
//     }
//     return GroupedCategories;
// }

// /**
//  * Receives an object that contains a category group and its categories, and returns a map of group ids as keys and names as values 
//  */
// function createMapGroupCategoryIdToName(categoriesObj) {
//     var CategoryGroupsNames = {};
//     for (var i = 0; i < categoriesObj.length; i++) {
//         var catGroup = categoriesObj[i].categoryGroup;
//         CategoryGroupsNames[catGroup.Id] = catGroup.Name;
//     }
//     return CategoryGroupsNames;
// }

// /**
//  * The function receives a list of HC applications, concats the parent app's name to the child's app on the child object and returns the modified list
//  */
// function organizeAppsNamesList(queryResult) {
//     var parentNames = [];
//     var editedResults = [];
//     for (var i = 0; i < queryResult.length; i++) {
//         if (queryResult[i].Parent_Application__c != null) {
//             queryResult[i].Name = queryResult[i].Parent_Application__r.Name + " - " + queryResult[i].Name;
//             parentNames.push(queryResult[i].Parent_Application__r.Name);
//         }
//     }
//     for (var i = 0; i < queryResult.length; i++) {
//         if (!parentNames.includes(queryResult[i].Name)) {
//             editedResults.push(queryResult[i]);
//         }
//     }
//     return editedResults;
// }
// module.exports = {
//     showCaseCreationModal,
//     handleCaseCreationModal,
// };
