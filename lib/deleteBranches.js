const simpleGit = require('simple-git');
const git = simpleGit();

module.exports = {
    getBranches: async () => {
        try {
            const branches = await git.branchLocal();

            return branches.all;
        } catch (error) {
            console.error(error);
        }
    },

    deleteBranches: async (branches) => {
        try {
            await git.deleteLocalBranches(branches);
        } catch (error) {
            console.error(error);
        }
    }
};