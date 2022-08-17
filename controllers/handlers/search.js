const salesforceService = require("../../services/salesforce.service");

async function knowledgeArticlesSearch(searchTerm, channelId, username, client) {
    const userEmail = `${username}@salesforce.com`;
    const result = salesforceService.searchKnowledgeArticles(searchTerm, channelId);

}

module.exports = {
    knowledgeArticlesSearch
  };
  