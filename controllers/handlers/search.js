const salesforceService = require("../../services/salesforce.service");

async function knowledgeArticlesSearch(searchTerm, channelId, username, userId, client) {
    const userEmail = `${username}@salesforce.com`;
    const results = await salesforceService.searchKnowledgeArticles(searchTerm, channelId);
    console.log(results);
    //Creates blocks to display to the user
    var articleBlocks = [];
    results.forEach(article => {
        blocks.push({
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
  