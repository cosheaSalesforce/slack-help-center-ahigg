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
            if (err) {
                return null;
            }
        });
    } catch (ex) {
        return false;
    }
    return loggedIn;
}


async function getDomain() {
    var details = await checkAuth();
    return details.urls.custom_domain;
}

async function getSlackChannelAndHcApplication(channelId) {
    await checkAuth();
    return await conn.apex.get(`/slackChannels/${channelId}`, function (err, res) {
        if (err) {
            return err;
        }
    });
}

async function getGroupedCategories(HcApp) {
    await checkAuth();
    return await conn.apex.get(`/hcsGroupedCategories/${HcApp}`, function (err, res) {
        if (err) {
            return err;
        }
    });
}

//Creates a new help-center case
async function createHcCase(channelId, application, categoriesIds, subject, description, userEmail, timeStamp) {
    console.log('Hurray, now to test the back-end side!');

    await checkAuth();
    var body = {
        channel: channelId,
        hcApp: application,
        msgSubject: subject,
        msgDescription: description,
        categories: categoriesIds,
        caseContactIdentifier: userEmail,
        messageTimeStampIdentifier: timeStamp,
        caseOrigin: 'Slack',
        caseCreatedViaSlackWorkflow: true,
    };

    //console.log(body);
    try {
        await conn.apex.post("/createCase/", body, function (err, result) {
            console.log(result);
            if (err) {
                console.log(err);
                return null;
            }
            // else {
            //     console.log(result);
            //     return result;
            // }
        });
    } catch (error) {
        /// mixpanelService.trackErrors(error, "showNewModal", usersEmail);
        console.log(error);
    }
}

async function getAllHcApplications() {
    await checkAuth();
    return conn.apex.get(`/hcApplications/`, function (err, res) {
        if (err) {
            return err;
        }
    });
}

async function updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs) {
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
    return await conn.apex.get(`/SearchKnowledgeArticles/${searchTerm}/${channelId}/`, function (err, result) {
        if (err) {
            return null;
        }
    })

}



async function getSlackChannelMessages() {
    await checkAuth();
    return await conn.apex.get(`/SlackChannelMessages`, function(err, result) {
        if (err) {
            return null;
        }
    });
} 


module.exports = {
    doLogin,
    getDomain,
    getSlackChannelAndHcApplication,
    getGroupedCategories,
    createHcCase,
    updateCaseStatus,
    searchKnowledgeArticles,
    getAllHcApplications,
    getSlackChannelMessages
}


