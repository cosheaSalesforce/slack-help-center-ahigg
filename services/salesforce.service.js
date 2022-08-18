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

// async function getCategoryGroup(HcApp) {
//     //await checkAuth();
//     return await conn.apex.get(`/hcsGroupedCategories/${HcApp}`, function (err, res) {
//         if (err) {
//             return err;
//         }
//     });
// }
// //hcsGroupedCategories
// async function getCategories(categoryGroup) {
//     //await checkAuth();
//     return await conn.apex.get(`/categories/${categoryGroup}`, function (err, res) {
//         if (err) {
//             return err;
//         }
//     });
// }

async function getGroupedCategories(HcApp) {
    await checkAuth();
    return await conn.apex.get(`/hcsGroupedCategories/${HcApp}`, function (err, res) {
        if (err) {
            return err;
        }
    });
}

//Creates a new help-center case
async function createHcCase(channelId, application, catGroupAndOptionsIds, subject, description, userId) {
    await checkAuth();
    var body = {
        channel: channelId,
        hcApp: application,
        msgSubject: subject,
        msgDescription: description,
        caseContact: userId,
        categories: catGroupAndOptionsIds,
    };

    console.log('Hurray, now to test the back-end side!');
    // // ---------- TESTING FRONT END, REMOVE FROM COMMENTS LATER ----------
    // const returnedCase = await conn.apex.post("/HelpCenterCase/", body, function (err, returnedBc) {
    //     if (err) {
    //         return null;
    //     }
    // });
    // // ---------- END OF THE SECTION THAT NEEDS TO BE UN-COMMENTED ----------

    // var bodyAuth = { bc: returnedCase };
    // const result = await conn.apex.post("/BusinessCaseCalculatorAuthentication/", bodyAuth, function (err, result) {
    //     if (err) {
    //         return null;
    //     }
    // });
    //return returnedCase;
}

async function updateCaseStatus(userEmail, statusToUpdate, channelId, messageTs, parentMessageTs) {
    await checkAuth();
    var body = {
        userEmail: userEmail,
        statusToUpdate: statusToUpdate,
        channelId: channelId,
        messageTs: messageTs,
        parentMessageTs: parentMessageTs
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


module.exports = {
    doLogin,
    getDomain,
    getSlackChannelAndHcApplication,
    getGroupedCategories,
    createHcCase,
    updateCaseStatus,
}


