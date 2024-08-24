const home = require('os').homedir();
const name = require('./package.json').name;

module.exports = {
    apps: [
        {
            name,
            script: 'npm',
            args: 'start',
            out_file: `${home}/.pm2/logs/${name}/${name}.log`,
            error_file: `${home}/.pm2/logs/${name}/${name}.log`,
            env: { NODE_ENV: 'production' },
        },
    ],
};
