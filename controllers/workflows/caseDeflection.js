async function caseCreationWorkflow() {
    const ws = new WorkflowStep('case_deflection', {
        edit: async ({ ack, step, configure }) => {
            await ack();
            console.log("inside edit");
            console.log(step);

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
            await ack();
            console.log("inside save");


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
            console.log("inside execute");

            const { inputs } = step;

            const outputs = {
                username: inputs.username.value,
                channelID: inputs.channelID.value,
            };

            // signal back to Slack that everything was successful
            console.log(inputs.username.value);
            console.log(inputs.channelID.value);
            console.log(step);
            await complete({ outputs });
        },
    });

    module.exports = {
        caseCreationWorkflow,
    };
}