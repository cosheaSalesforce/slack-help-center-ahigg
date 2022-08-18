// const mixpanelService = require("./mixpanel.service");
//
var jsforce = require("jsforce");
const { ContextMissingPropertyError } = require("@slack/bolt");
require("dotenv").config();

const conn = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com",
});

async function checkAuth() {
    try {
        var identity = await conn.identity();
        return identity;
    } catch (ex) {
        await doLogin();
        var identity = await conn.identity();
        return identity;
    }
}

// Login to the BVD Org
async function doLogin() {
    try {
        var loggedIn = await conn.login('hcslack@hcslackdev.com', 'Ye08tPGXYnYa' + 'cbTVDApgwrgXoyCzn4377yBmt', function (err, userInfo) {
            console.log('Successfull login - hurray!');
            if (err) {
                return null;
            }
        });
    } catch (ex) {
        return false;
    }
    return loggedIn;
}

async function updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs, messageContent) {
    await checkAuth();
    var body = {
        userEmail: userEmail,
        statusToUpdate: statusToUpdate,
        channelId: channelId,
        messageTs: messageTs,
        parentMessageTs: parentMessageTs,
        messageContent: messageContent
    };
    console.log(body);
    await conn.apex.post("/UpdateCaseStatus/", body, function (err, result) {
        if (err) {
            console.log(err);
            return null;
        }
        else {
            console.log(result);
            return result;
        }
    });
}

async function searchKnowledgeArticles(searchTerm, channelId) {
    await checkAuth();
    return await conn.apex.get(`/SearchKnowledgeArticles/${searchTerm}/${channelId}/`, function(err, result) {
        if (err) {
            return null;
        }
    })

}

module.exports = {
    doLogin,
    updateCaseStatus,
    searchKnowledgeArticles
};
