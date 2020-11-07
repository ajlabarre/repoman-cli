#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const brancherPrompt = require('./lib/brancherPrompt');
const branches = require('./lib/branches');

clear();

console.log(
    chalk.cyanBright(
        figlet.textSync('BrancherCLI', { horizontalLayout: 'full' })
    )
);

const checkoutBranchPrompt = async () => {
    try {
        const branchList = await branches.getBranches();
        const branch = await brancherPrompt.listBranches(branchList);
        await branches.checkoutBranch(branch);
    } catch (error) {
        console.error(error);
    }
};

const deleteBranchesPrompt = async () => {
    try {
        const branchList = await branches.getBranches();
        const branchesToDelete = await brancherPrompt.deleteBranches(branchList);
        await branches.deleteBranches(branchesToDelete);
    } catch (error) {
        console.error(error);
    }
};

const start = async () => {
    try {
        const action = await brancherPrompt.listChoices();
        console.log('action', action);
        switch (action) {
            case 'checkoutBranch':
                return checkoutBranchPrompt();
            case 'deleteBranches':
                return deleteBranchesPrompt();
        }

    } catch (error) {
        console.error(error);
    }
};

start();
