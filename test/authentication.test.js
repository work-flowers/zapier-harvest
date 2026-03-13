const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('authentication', () => {
  it('passes authentication and returns user data', async () => {
    const bundle = {
      authData: {
        accessToken: process.env.ACCESS_TOKEN,
        accountId: process.env.ACCOUNT_ID,
      },
    };

    const response = await appTester(App.authentication.test, bundle);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('first_name');
    expect(response).toHaveProperty('email');
  });
});
