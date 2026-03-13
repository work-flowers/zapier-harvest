const authentication = require('./authentication');
const { befores = [], afters = [] } = require('./middleware');
const projectActiveStatusChanged = require('./triggers/projectActiveStatusChanged');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],
  afterResponse: [...afters],

  triggers: {
    [projectActiveStatusChanged.key]: projectActiveStatusChanged,
  },

  searches: {},
  creates: {},
  resources: {},
};
