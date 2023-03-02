const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const REFRESH_CACHE_TIMEOUT = 10;

const execCmd = async (cmd, type) => {
    try {
        var resp = await exec(cmd);
    } catch (failed) {
        throw new Error('Command execution failed with ' + failed)
    };

    if (type == 'json') {
        return JSON.parse(resp.stdout.trim()) // add test case
    }

    return resp.stdout.trim();
};

module.exports.templateTags = [
    {
        displayName: '/bin/sh',
        name: 'shell',
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
                displayName: 'Command/shell to be executed',
                help: 'Executes the given command using require("child_process").exec command',
                type: 'string',
                encoding: 'base64',
            },
            {
                displayName: 'Cache results (fresh results are still fetched in the background)',
                type: 'boolean',
                options: [
                    { displayName: 'true', value: true },
                    { displayName: 'false', value: false }
                ],
            },
        ],
        async run(context, type = 'string', cmd, cacheResults) {
            const cacheKey = `cmd-${cmd}`;

            if (cacheResults && (await context.store.hasItem(cacheKey))) {
                const cachedValue = await context.store.getItem(cacheKey);

                // refresh cache in background
                setTimeout(async () => {
                    const newCachedValue = await execCmd(cmd, type);
                    await context.store.setItem(cacheKey, newCachedValue);
                }, REFRESH_CACHE_TIMEOUT);

                return cachedValue;
            } else if (!cacheResults) {
                // purge old cache in background
                setTimeout(async () => {
                    context.store.removeItem(cacheKey);
                }, REFRESH_CACHE_TIMEOUT);
            }

            const out = await execCmd(cmd, type);
            context.store.setItem(cacheKey, out);

            return out;
        },
    },
];
