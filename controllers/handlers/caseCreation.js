const salesforceService = require("../../services/salesforce.service");

/**
 * The function creates the initial modal for creating a new case
 */
async function showCaseCreationModal(payload, client, channelId) {
    try {
        console.log("Welcome to the case creation modal!!");
        console.log(channelId);



        //var viewFromat = businessCaseFormat.createBusinessCaseFormat();
        // var usersEmail = payload.user_name + "@salesforce.com";
        // const result = await client.views.open({
        //     // Pass a valid trigger_id within 3 seconds of receiving it
        //     trigger_id: payload.trigger_id,
        //     // View payload
        //     view: viewFromat,
        // });
        // var userFromOrg = await salesforceService.getUsersDetailsFromOrg(payload.user.name + "@salesforce.com", payload.user.id);
        // if (userFromOrg.length == 0) {
        //     await client.chat.postEphemeral({
        //         channel: payload.user.id,
        //         user: payload.user.id,
        //         text: "An error occurred, please contact our Help-Center team!",
        //     });
        // }
    } catch (error) {
        // mixpanelService.trackErrors(error, "showNewModal", usersEmail);
    }
}

module.exports = {
    showCaseCreationModal,
};
