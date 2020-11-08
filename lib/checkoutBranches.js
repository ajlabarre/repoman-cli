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

  checkoutBranch: async (branch) => {
    try {
      await git.checkout(branch);
    } catch (error) {
      console.error(error);
    }
  },
};
