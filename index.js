const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const REFRESH_CACHE_TIMEOUT = 10;

const execCmd = async (cmd)  => {

  try {
    var resp = await exec(cmd);
  } catch (failed) {
    console.log('Command execution failed with ' + failed)
    return failed.stderr;
  };

  if (type == 'json') {
    return JSON.parse(resp.stdout.trim()) // add test case
  }

  return resp.stdout.trim();
};

module.exports.templateTags = [
  {
    displayName: '/bin/sh',
    name: 'shCmdExec',
    description: 'Executes given command using child_process package, basically /bin/sh cmd',
    args: [
      {
        displayName: 'Type',
        type: 'enum',
        options: [
          { displayName: 'Execute command returning String value', value: 'string' },
          { displayName: 'Execute command returning JSON value', value: 'json' }
        ],
      },
      {
        displayName: 'Cache results',
        type: 'boolean',
        options: [
          { displayName: 'Enable caching of results (fresh results are still fetched in the background)', value: true },
          { displayName: 'Don\'t enable caching of results', value: false }
        ],
      },
      {
        displayName: 'Command/shell to be executed',
        help: 'Executes the given command using require("child_process").exec command',
        type: 'string',
      }
    ],
    async run(context, type = 'string', cmd) {
      const cacheKey = `cmd-${cmd}`;
      const hasCachedValue = await context.store.hasItem(cacheKey);

      if (hasCachedValue) {
        const cachedValue = await context.store.getItem();

        // refresh cache in background
        setTimeout(async () => {
          const cacheValue = await execCmd(key);
          await context.store.setItem(cacheKey, cacheValue);
        }, REFRESH_CACHE_TIMEOUT);

        return cachedValue;
      }

      return execCmd(cmd);
    },
  },
];
