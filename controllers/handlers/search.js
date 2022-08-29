const salesforceService = require("../../services/salesforce.service");
const mixpanelService = require("../../services/mixpanel.service");

async function knowledgeArticlesSearch(searchTerm, channelId, username, userId, client) {
    const userEmail = `${username}@salesforce.com`;
    const results = await salesforceService.searchKnowledgeArticles(searchTerm, channelId, 10);
    console.log(results);
    
    //TODO: Spreate to another file
    //Creates blocks to display to the user
    var articleBlocks = [];
    results.forEach(article => {
        articleBlocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: article.Title,
            },
          });
    });

  //Sends ephmeral message to the user
  await client.chat.postEphemeral({
    channel: channelId,
    user: userId,
    text: "Here's a list of your business cases!",
    blocks: articleBlocks
  });

}

module.exports = {
  knowledgeArticlesSearch
};
