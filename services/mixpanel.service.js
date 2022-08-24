// grab the Mixpanel factory
//var Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
//var mixpanel = Mixpanel.init(process.env.MIXPANEL_KEY);

function trackWorkFlowClick(user) {
    mixpanel.track(
        "HCS",
        {
            "action": "workflow_fired_up",
            "distinct_id": user,
        }
    );
}

function trackNewCaseClick(user) {
    mixpanel.track(
        "HCS",
        {
            "action": "case_creation_process_begins",
            "distinct_id": user,
        }
    );
}

function trackCaseSubmission(user, subject) {
    mixpanel.track(
        "HCS",
        {
            "action": "case_submitted",
            "distinct_id": user,
            "case_subject": subject
        }
    );
}

function trackUserSearch(user, searchTerm) {
    mixpanel.track(
        "HCS",
        {
            "action": "user_search",
            "distinct_id": user,
            "search_term": searchTerm
        }
    );
}

// function trackErrors(incomingError, errorLocation, user) {
//     mixpanel.track(
//         "BVD Slack",
//         {
//             "action": "incoming_error",
//             "distinct_id": user,
//             "error_information": incomingError.message,
//             "error_location": errorLocation
//         }
//     );
// }

module.exports = {
    trackWorkFlowClick,
    trackNewCaseClick,
    trackCaseSubmission,
    trackUserSearch,
    //trackErrors,
};
