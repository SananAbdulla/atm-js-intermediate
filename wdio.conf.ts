import 'dotenv/config';

export const config = {
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: 'tsconfig.json',
    },
  },

  runner: 'local' as const,

  specs: ['./src/tests/**/*.tests.ts'],

  maxInstances: 1,

  capabilities: [
    {
      browserName: 'chrome',
    },
  ],

  logLevel: 'warn' as const,

  bail: 0,
  baseUrl: process.env.BASE_URL || 'https://cloud.google.com',

  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  reporters: ['spec'],
  services: ['chromedriver'],

  framework: 'mocha',
  mochaOpts: {
    timeout: 60000,
  },

  async before() {
    await browser.setWindowSize(1280, 720);
  },
};
