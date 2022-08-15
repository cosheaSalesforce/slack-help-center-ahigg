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

async function getSlackChannelAndHcApplication(channelId) {
    //await checkAuth();
    return await conn.apex.get(`/slackChannels/${channelId}`, function (err, res) {
        if (err) {
            return err;
        }
    });
}

async function getCategoryGroup(HcApp) {
    //await checkAuth();
    return await conn.apex.get(`/categoryGroup/${HcApp}`, function (err, res) {
        if (err) {
            return err;
        }
    });
}

async function getCategories(categoryGroup) {
    //await checkAuth();
    return await conn.apex.get(`/categories/${categoryGroup}`, function (err, res) {
        if (err) {
            return err;
        }
    });
}


module.exports = {
    doLogin,
    getSlackChannelAndHcApplication,
    getCategoryGroup,
    getCategories,
};
