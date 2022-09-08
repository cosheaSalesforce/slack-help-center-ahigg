const salesforceService = require("../../services/salesforce.service");
const mixpanelService = require("../../services/mixpanel.service");
const createArticlesBlockHandler = require("..//..//slack-ui/blocks/knowledgeArticlesBlockFormat");

async function knowledgeArticlesSearch(searchTerm, channelId, username, userId, client) {
  const userEmail = `${username}@salesforce.com`;
  const results = await salesforceService.searchKnowledgeArticles(searchTerm, channelId, 10);

  var url = await salesforceService.getDomain();
  url = url + "/" + results.Id;

  //Creates blocks to display to the user
  var articleBlocks = [];
  results.forEach(article => {
    var link = url + "/" + results.Id;
    var lastModifiedDate = getLastModifiedDateAsString(article.LastModifiedDate);
    var block = createArticlesBlockHandler.createArticlesMsgFormat(article.Title, article.ArticleCreatedBy.Name, lastModifiedDate, link);
    await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: "Here's a list of your business cases!",
      blocks: block
    });
    articleBlocks.push(block);
  });

  // //Sends ephmeral message to the user
  // await client.chat.postEphemeral({
  //   channel: channelId,
  //   user: userId,
  //   text: "Here's a list of your business cases!",
  //   blocks: articleBlocks
  // });

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
  return (createdDate == lastModifiedDate) ? 'Created ' + retVal : 'Updated ' + retVal;
}

module.exports = {
  knowledgeArticlesSearch
};
