#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const repoManPrompts = require('./lib/prompts');
const checkoutBranches = require('./lib/checkoutBranches');
const deleteBranches = require('./lib/deleteBranches');
const createNewRepo = require('./lib/createNewRepo');

// Clear the terminal so CLI appears at the top
clear();

console.log(
  chalk.cyanBright(figlet.textSync('RepoMan CLI', { horizontalLayout: 'full' }))
);

console.log(
  'RepoMan CLI is a lightweight command line tool that allows you to easily manage git branches'
);
console.log('See https://github.com/ajlabarre/repoman-cli for more details \n');

const checkoutBranchPrompt = async () => {
  try {
    const branchList = await checkoutBranches.getBranches();
    const branch = await repoManPrompts.listBranches(branchList);
    await checkoutBranches.checkoutBranch(branch);
  } catch (error) {
    console.error(error);
  }
};

const deleteBranchesPrompt = async () => {
  try {
    const branchList = await deleteBranches.getBranches();
    const branchesToDelete = await repoManPrompts.deleteBranches(branchList);
    await deleteBranches.deleteBranches(branchesToDelete);
  } catch (error) {
    console.error(error);
  }
};

const getGithubToken = async () => {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if (token) {
    return token;
  }

  // No token found, use credentials to access GitHub account
  token = await github.getPersonalAccesToken();

  return token;
};

const createNewRepoPrompt = async () => {
  try {
    if (files.directoryExists('.git')) {
      console.log(chalk.red('Already a Git repository!'));
      process.exit();
    }

    // Retrieve & Set Authentication Token
    const token = await getGithubToken();
    github.githubAuth(token);

    // Create remote repository
    const url = await createNewRepo.createRemoteRepo();

    // Create .gitignore file
    await createNewRepo.createGitignore();

    // Set up local repository and push to remote
    await createNewRepo.setupRepo(url);

    console.log(chalk.green('All done!'));
  } catch (error) {
    switch (error.status) {
      case 401:
        console.log(
          chalk.red(
            "Couldn't log you in. Please provide correct credentials/token."
          )
        );
        break;
      case 422:
        console.log(
          chalk.red(
            'There is already a remote repository or token with the same name'
          )
        );
        break;

      default:
        console.log(chalk.red(error));
    }
  }
};

const start = async () => {
  try {
    const action = await repoManPrompts.listChoices();

    switch (action) {
      case 'checkoutBranch':
        return checkoutBranchPrompt();
      case 'deleteBranches':
        return deleteBranchesPrompt();
      case 'createNewRepo':
        return createNewRepoPrompt();
    }
  } catch (error) {
    console.error(error);
  }
};

start();
