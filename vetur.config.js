/**
 * @Author: longmo
 * @Date: 2025-11-23 11:40:20
 * @LastEditTime: 2025-11-23 11:40:38
 * @FilePath: vetur.config.js
 * @Description: vetur.config.js
 */
/** @type {import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
  },
  // **optional** default: `[{ root: './' }]`
  // support monorepos
  projects: ['./'],
};
