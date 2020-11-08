const inquirer = require('inquirer');
const files = require('./files');

const mapAnswers = (answerString = 'default') => {
  switch (answerString) {
    case 'Checkout branch':
      return 'checkoutBranch';
    case 'Delete branches':
      return 'deleteBranches';
    case 'Create new repo':
      return 'createNewRepo';

    case 'default':
  }
};

module.exports = {
  askGithubCredentials: async () => {
    const answer = await inquirer.prompt([
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username or e-mail address:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        },
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        },
      },
    ]);
    return answer;
  },
  getTwoFactorAuthenticationCode: () => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code:',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your two-factor authentication code.';
        }
      },
    });
  },
  askRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a name for the repository.';
          }
        },
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:',
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private:',
        choices: ['public', 'private'],
        default: 'public',
      },
    ];
    return inquirer.prompt(questions);
  },
  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components'],
      },
    ];
    return inquirer.prompt(questions);
  },
  listBranches: async (branches) => {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'checkoutBranch',
          message: 'Which branch would you like to checkout?',
          choices: branches,
        },
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
          choices: branches,
        },
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
          choices: ['Create new repo', 'Checkout branch', 'Delete branches'],
        },
      ]);

      return mapAnswers(answer.listChoices);
    } catch (error) {
      console.error(error);
    }
  },
};
