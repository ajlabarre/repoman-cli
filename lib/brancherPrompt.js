const inquirer = require('inquirer');

const mapAnswers = (answerString = 'default') => {
    switch (answerString) {
        case 'Checkout branch':
            return 'checkoutBranch';
        case 'Delete branches':
            return 'deleteBranches';
        case 'default':
            return;
    }
}

module.exports = {
    listBranches: async (branches) => {
        try {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'checkoutBranch',
                    message: 'Which branch would you like to checkout?',
                    choices: branches
                }
            ]);
            return answer.checkoutBranch;
        } catch (error) {
            console.error(error);
        }
    },

    deleteBranches: async (branches) => {
        try {
            const answer = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'deleteBranches',
                    message: 'Which branches would you like to delete?',
                    choices: branches
                }
            ]);
            return answer.deleteBranches;
        } catch (error) {
            console.error(error);
        }
    },

    listChoices: async () => {
        try {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'listChoices',
                    message: 'Select action:',
                    choices: [
                        'Checkout branch',
                        'Delete branches'
                    ]
                }
            ]);

            return mapAnswers(answer.listChoices);
        } catch (error) {
            console.error(error);
        }
    },
};