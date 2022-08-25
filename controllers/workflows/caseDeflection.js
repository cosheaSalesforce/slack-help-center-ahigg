const deflectFromWorkflowHandler = require("../handlers/deflectFromWorkflow");

const { WorkflowStep } = require("@slack/bolt");

async function caseCreationWorkflow() {
    const ws = new WorkflowStep('case_deflection', {
        edit: async ({ ack, step, configure }) => {
            await ack();

            const blocks = [
                {
                    type: 'input',
                    block_id: 'user_name',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'username',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Add a username',
                        },
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Username',
                    },
                },
                {
                    type: 'input',
                    block_id: 'channel_id',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'channel',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Add a channel ID',
                        },
                    },
                    label: {
                        type: 'plain_text',
                        text: 'channel ID',
                    },
                },
            ];

            await configure({ blocks });
        },
        save: async ({ ack, step, view, update }) => {
            //await ack();

            const { values } = view.state;
            const username = values.user_name.username;
            const channelID = values.channel_id.channel;

            const inputs = {
                username: { value: username.value },
                channelID: { value: channelID.value }
            };
            //------------- START OF SECTION: TEST VALUES THAT WERE ENTERED BY THE USER -------------
            console.log(inputs);
            var errors = deflectFromWorkflowHandler.checkWorkflowVariables(username.value, channelID.value);
            if (Object.entries(errors).length > 0) {
                await ack({
                    response_action: 'errors',
                    errors: errors
                });
            }
            // else {
            //     await ack(); // close this modal - or also possible to set `response_action: 'clear'`
            // }
            await ack();
            //------------- END OF SECTION: TEST VALUES THAT WERE ENTERED BY THE USER ---------------
            const outputs = [
                {
                    type: 'text',
                    name: 'username',
                    label: 'Username',
                },
                {
                    type: 'text',
                    name: 'channelID',
                    label: 'Channel ID',
                }
            ];

            await update({ inputs, outputs });
        },
        execute: async ({ step, complete, fail }) => {

            const { inputs } = step;

            const outputs = {
                username: inputs.username.value,
                channelID: inputs.channelID.value,
            };

            // signal back to Slack that everything was successful
            deflectFromWorkflowHandler.postDeflectionMessage(inputs.username.value, inputs.channelID.value);
            await complete({ outputs });

        },
    });
    return ws;
}

module.exports = {
    caseCreationWorkflow,
};