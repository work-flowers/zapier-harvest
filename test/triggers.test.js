const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('project_active_status_changed trigger', () => {
  it('returns projects with composite dedup IDs', async () => {
    const bundle = {
      authData: {
        accessToken: process.env.ACCESS_TOKEN,
        accountId: process.env.ACCOUNT_ID,
      },
      inputData: {},
    };

    const results = await appTester(
      App.triggers.project_active_status_changed.operation.perform,
      bundle
    );

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    const first = results[0];
    // Composite ID should be "{project_id}-{is_active}"
    expect(first.id).toMatch(/^\d+-(true|false)$/);
    expect(first).toHaveProperty('project_id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('is_active');
    expect(typeof first.is_active).toBe('boolean');
    expect(first).toHaveProperty('client_name');
    expect(first).toHaveProperty('updated_at');
  });

  it('returns results sorted newest first', async () => {
    const bundle = {
      authData: {
        accessToken: process.env.ACCESS_TOKEN,
        accountId: process.env.ACCOUNT_ID,
      },
      inputData: {},
    };

    const results = await appTester(
      App.triggers.project_active_status_changed.operation.perform,
      bundle
    );

    if (results.length >= 2) {
      const first = new Date(results[0].updated_at).getTime();
      const second = new Date(results[1].updated_at).getTime();
      expect(first).toBeGreaterThanOrEqual(second);
    }
  });
});
