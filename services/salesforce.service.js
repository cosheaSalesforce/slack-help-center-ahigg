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
        var loggedIn = await conn.login('hcslack@hcslackcs.com	', 'cjkdfs^#kfd0ldSfbndsbf3@gd' + 'nIpIYGGyB1xJucpF5BAza705x', function (err, userInfo) {
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

/**
 * The function receives a slack channel's slack ID and returns a SlackChannel object that matches the given ID
 */
async function getSlackChannelAndHcApplication(channelId) {
    await checkAuth();
    try {
        return await conn.apex.get(`/slackChannels/${channelId}`, function (err, res) {
            if (err) {
                return err;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * The function receives HcApplication's ID and returns an object which holds
 * all the category options, as well as the category group's name, that match the given application
 */
async function getGroupedCategories(HcApp) {
    await checkAuth();
    try {
        return await conn.apex.get(`/hcsGroupedCategories/${HcApp}`, function (err, res) {
            if (err) {
                return err;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * The function receives the required data to create a new HC-Case
 */
async function createHcCase(channelId, application, categoriesIds, subject, description, userEmail, timeStamp) {

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

    try {
        await conn.apex.post("/createCase/", body, function (err, result) {
            console.log(result);
            if (err) {
                console.log(err);
                return null;
            }
        });
    } catch (error) {
        /// mixpanelService.trackErrors(error, "showNewModal", usersEmail);
        console.error(error);
    }
}

/**
 * The fucntion returns all the existing HcApplications from the org
 */
async function getAllHcApplications() {
    await checkAuth();
    try {
        return conn.apex.get(`/hcApplications/`, function (err, res) {
            if (err) {
                return err;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs, messageContent, messageOwnerEmail) {
    await checkAuth();
    var body = {
        userEmail: userEmail,
        statusToUpdate: statusToUpdate,
        channelId: channelId,
        messageTs: messageTs,
        parentMessageTs: parentMessageTs,
        messageContent: messageContent,
        messageOwnerEmail: messageOwnerEmail
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


async function searchKnowledgeArticles(searchTerm, channelId, amount) {
    //TODO: Add handling speical chars
    var searchTermEncoded = encodeURIComponent(getFixedSearchTerm(searchTerm));
    await checkAuth();
    return await conn.apex.get(`/SearchKnowledgeArticles?searchQuery=${searchTermEncoded}&channelId=${channelId}&amount=${amount}`, function (err, result) {
        if (err) {
            return null;
        }
    })

}

function getFixedSearchTerm(param) {
    var result = param, replacements = [["-", "\\-"], ["[", "\\["], ["]", "\\]"], ["?", "\\?"],
    ["&", "\\&"], ["|", "\\|"], ["!", "\\!"], ["{", "\\{"],
    ["}", "\\}"], ["(", "\\("], [")", "\\)"], ["^", "\\^"],
    ["~", "\\~"], ["*", "\\*"], [":", "\\:"], ["'", "\\'"],
    ["+", "\\+"],],
        r;
    while (
        (r = replacements.shift()) &&
        (result = String.prototype.replace.apply(result, r))
    ) { }
    // result = "*" + result + "*"
    return result;
}



async function getSlackChannelMessages() {
    await checkAuth();
    return await conn.apex.get(`/SlackChannelMessages`, function (err, result) {
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


