async function caseCreationWorkflow() {
    const ws = new WorkflowStep('workflow_example', {
        edit: async ({ ack, step, configure }) => {
            await ack();
            console.log("inside edit");
            console.log(step);

            const blocks = [
                {
                    type: 'input',
                    block_id: 'task_name_input',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'name',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Add a task name',
                        },
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Task name',
                    },
                },
                {
                    type: 'input',
                    block_id: 'task_description_input',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'description',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Add a task description',
                        },
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Task description',
                    },
                },
            ];

            await configure({ blocks });
        },
        save: async ({ ack, step, view, update }) => {
            await ack();
            console.log("inside save");


            const { values } = view.state;
            const taskName = values.task_name_input.name;
            const taskDescription = values.task_description_input.description;

            const inputs = {
                taskName: { value: taskName.value },
                taskDescription: { value: taskDescription.value }
            };

            const outputs = [
                {
                    type: 'text',
                    name: 'taskName',
                    label: 'Task name',
                },
                {
                    type: 'text',
                    name: 'taskDescription',
                    label: 'Task description',
                }
            ];

            await update({ inputs, outputs });
        },
        execute: async ({ step, complete, fail }) => {
            console.log("inside execute");

            const { inputs } = step;

            const outputs = {
                taskName: inputs.taskName.value,
                taskDescription: inputs.taskDescription.value,
            };

            // signal back to Slack that everything was successful
            console.log(inputs.taskName.value);
            console.log(inputs.taskDescription.value);
            console.log(step);
            await complete({ outputs });
        },
    });

    module.exports = {
        caseCreationWorkflow,
    };
}