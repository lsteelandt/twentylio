// @ts-check
/** @type {import('@yarnpkg/types')} */
const { defineConfig, Yarn } = require('@yarnpkg/types');
const semver = require('semver');

const MONOREPO_ROOT_WORKSPACE = 'twenty';

module.exports = defineConfig({
  async constraints({ Yarn }) {
    // Temporarily disable Node version constraint for twenty-e2e-testing package installation
    const currentWorkspaceIdent = process.env.YARN_WORKSPACE_NAME;
    if (currentWorkspaceIdent === 'twenty-e2e-testing') {
      return; // Skip constraint check for this workspace
    }

    const rootWorkspace = Yarn.workspace({ ident: MONOREPO_ROOT_WORKSPACE });
    if (!rootWorkspace) {
      throw new Error(
        `Should never occur, ${MONOREPO_ROOT_WORKSPACE} workspace not found`,
      );
    }

    const requiredNodeVersion = rootWorkspace.manifest.engines?.node;
    if (!requiredNodeVersion) {
      throw new Error(
        `Should never occur, ${requiredNodeVersion} could not find node range in engines manifest`,
      );
    }

    const currentNodeVersion = process.version;
    if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
      throw new Error(
        `Node version ${currentNodeVersion} doesn't match the required version, please use ${requiredNodeVersion}`,
      );
    }
  },
});
