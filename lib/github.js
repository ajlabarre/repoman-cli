const CLI = require('clui');
const Configstore = require('configstore');
const { Octokit } = require('@octokit/rest');
const Spinner = CLI.Spinner;
const { createBasicAuth } = require('@octokit/auth-basic');

const prompts = require('./prompts');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name);

let octokit;

module.exports = {
  getInstance: () => {
    return octokit;
  },

  getStoredGithubToken: () => {
    return conf.get('github.token');
  },

  githubAuth: (token) => {
    octokit = new Octokit({ auth: token });
  },

  getPersonalAccesToken: async () => {
    const credentials = await prompts.askGithubCredentials();
    const status = new Spinner('Authenticating you, please wait...');

    status.start();

    const auth = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      async on2Fa() {
        status.stop();
        const res = await prompts.getTwoFactorAuthenticationCode();
        status.start();
        return res.twoFactorAuthenticationCode;
      },
      token: {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'RepoMan CLI, lightweight Github repository management CLI',
      },
    });

    try {
      const res = await auth();

      if (res.token) {
        conf.set('github.token', res.token);
        return res.token;
      } else {
        throw new Error('GitHub token was not found in the response');
      }
    } finally {
      status.stop();
    }
  },
};
