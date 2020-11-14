const inquirer = require('inquirer');
const files = require('./files');
const argv = require('minimist')(process.argv.slice(2));

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
  getTwoFactorAuthenticationCode: async () => {
    const auth = await inquirer.prompt({
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
    return auth;
  },
  askRepoDetails: async () => {
    const repoDetails = await inquirer.prompt([
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
    ]);
    return repoDetails;
  },
  askIgnoreFiles: async (filelist) => {
    const ignoreFiles = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components'],
      },
    ]);
    return ignoreFiles;
  },
  listBranches: async (branches) => {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'checkoutBranch',
        message: 'Which branch would you like to checkout?',
        choices: branches,
      },
    ]);
    return answer.checkoutBranch;
  },

  deleteBranches: async (branches) => {
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'deleteBranches',
        message: 'Which branches would you like to delete?',
        choices: branches,
      },
    ]);
    return answer.deleteBranches;
  },

  listChoices: async () => {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'listChoices',
        message: 'Select action:',
        // choices: ['Create new repo', 'Checkout branch', 'Delete branches'], Create new repo Coming soon: GH deprecated the API which was used for this previously
        choices: ['Checkout branch', 'Delete branches'],
      },
    ]);
    return mapAnswers(answer.listChoices);
  },
};
