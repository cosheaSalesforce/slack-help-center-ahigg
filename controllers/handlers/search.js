const salesforceService = require("../../services/salesforce.service");
const mixpanelService = require("../../services/mixpanel.service");
const createArticlesBlockHandler = require("..//..//slack-ui/blocks/knowledgeArticlesBlockFormat");
const caseSearchBlockHandler = require("..//..//slack-ui/blocks/caseSearchBlock");
const slackService = require("../../services/slack.service");

async function knowledgeArticlesSearch(searchTerm, channelId, username, userId, client) {
  const userEmail = `${username}@salesforce.com`;
  const results = await salesforceService.searchKnowledgeArticles(searchTerm, channelId, 10);
  var url = process.env.SITE_URL + '/help/s/article/';

  //Creates blocks to display to the user
  var articleBlocks = [];
  await results.forEach(article => {
    var link = url + article.UrlName;
    var lastModifiedDate = getLastModifiedDateAsString(article.LastModifiedDate, article.LastModifiedDate);
    var block = createArticlesBlockHandler.createArticlesMsgFormat(article.Title, article.ArticleCreatedBy.Name, lastModifiedDate, link);
    articleBlocks = articleBlocks.concat(block);
  });

  //Sends ephmeral message to the user
  await client.chat.postEphemeral({
    channel: channelId,
    user: userId,
    text: "Here's a list of relevant knowledge articles!",
    blocks: articleBlocks
  });

  //logging the search by the user with Mixpanel
  mixpanelService.trackUserSearch(userEmail, searchTerm);
}


async function searchRelevantCases(client, payload, channelId) {
  try {
    console.log("entered the function within the handlers");
    var userID = (payload['user_id']) ? payload['user_id'] : ((payload['user']['id']) ? payload['user']['id'] : null);
    var userEmail = await slackService.getUserEmailById(userID);
    console.log("successfully logged " + userEmail);
    var cases = await salesforceService.searchUsersCases(userEmail);
    console.log("retrieved the cases from the org");
    //**** CREATE A LIST VIEW FOR THE CASES
    var caseBlocks = [];
    await cases.forEach(singleCase => {
      console.log(singleCase);
      var url;
      if (singleCase.Origin == "Slack") {
        url = process.env.SLACK_URL + '/' + singleCase.SlackChannel__r.ChannelId__c + '/p' + singleCase.SlackThreadIdentifier__c.replace('.', '');
      } else {
        url = HELP_CENTER_URL;
      }
      var block = caseSearchBlockHandler.createCaseSearchFormat(singleCase.Subject, singleCase.Origin, singleCase.SlackChannel__c, url);
      caseBlocks = caseBlocks.concat(block);
    });

    await client.chat.postEphemeral({
      channel: channelId,
      user: payload.user_id,
      text: "Here's a list of your cases:",
      blocks: caseBlocks
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * The function returns when was the business case last created/updated 
 */
function getLastModifiedDateAsString(createdDate, lastModifiedDate) {
  var seconds = (new Date().getTime() - new Date(lastModifiedDate).getTime()) / 1000;
  var retVal;
  if (seconds > 31557600) {
    var x = Math.floor(seconds / 31557600).toString();
    if (x == 0) { x = 1; }
    retVal = x >= 2 ? x + ' Years Ago' : x + ' Year Ago';
  } else if (seconds > 2629800) {
    var x = Math.floor(seconds / 2629800).toString();
    if (x == 0) { x = 1; }
    retVal = x >= 2 ? x + ' Months Ago' : x + ' Month Ago';
  } else if (seconds > 604800) {
    var x = Math.floor(seconds / 2629800).toString();
    if (x == 0) { x = 1; }
    retVal = x >= 2 ? x + ' Weeks Ago' : x + ' Week Ago';
  } else if (seconds > 87660) {
    var x = Math.floor(seconds / 87660).toString();
    if (x == 0) { x = 1; }
    retVal = x >= 2 ? x + ' Days Ago' : x + ' Day Ago';
  } else if (seconds > 3600) {
    var x = Math.floor(seconds / 3600).toString();
    if (x == 0) { x = 1; }
    retVal = x >= 2 ? x + ' Hours Ago' : x + ' Hour Ago';
  } else {
    var x = Math.floor(seconds / 60).toString();
    if (x == 0) { x = 1; }
    retVal = x >= 2 ? x + ' Minutes Ago' : x + ' Minute Ago';
  }
  return retVal
}

module.exports = {
  knowledgeArticlesSearch,
  searchRelevantCases
};
