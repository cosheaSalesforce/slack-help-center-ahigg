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
                            text: '"Insert a variable" :arrow_right: "Person who clicked.." :arrow_right: "Email" option.',
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
                            text: '"Insert a variable" :arrow_right: "Channel where workflow started"',
                        },
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Channel ID',
                    },
                },
            ];

            await configure({ blocks });
        },
        save: async ({ ack, step, view, update }) => {
            await ack();
            const { values } = view.state;
            const username = values.user_name.username;
            const channelID = values.channel_id.channel;

            const inputs = {
                username: { value: username.value },
                channelID: { value: channelID.value }
            };
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