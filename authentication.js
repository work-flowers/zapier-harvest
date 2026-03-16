'use strict';

const test = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.harvestapp.com/v2/users/me',
  });
  return response.data;
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'accessToken',
      label: 'Personal Access Token',
      required: true,
      type: 'password',
      helpText:
        'Find this in Harvest under Settings > Developers > Personal Access Tokens.',
    },
    {
      key: 'accountId',
      label: 'Account ID',
      required: true,
      type: 'string',
      helpText:
        'Shown alongside your Personal Access Token in Harvest Developer Tools.',
    },
  ],
  test,
  connectionLabel: '{{first_name}} {{last_name}} ({{email}})',
};
