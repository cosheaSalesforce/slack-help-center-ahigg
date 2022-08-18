const salesforceService = require("../../services/salesforce.service");

async function knowledgeArticlesSearch(searchTerm, channelId, username, userId, client) {
    const userEmail = `${username}@salesforce.com`;
    const results = salesforceService.searchKnowledgeArticles(searchTerm, channelId);

    await client.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: "Here's a list of your business cases!",
      });

}

module.exports = {
    knowledgeArticlesSearch
  };
  