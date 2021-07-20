require("dotenv-expand")(require("dotenv").config());

const _instances = (process.env.NODE_ENV == 'development') ? 1 : 2;

module.exports = {
  apps : [{
    name: 'MdkApi',
    script: 'src/index.js',
    watch: true,
    instances: _instances,
    max_memory_restart: '256M',
    error_file: '~/.pm2/logs/app-mdkapi-err.log',
    out_file: '~/.pm2/logs/app-mdkapi-out.log',
    // out_file: '/dev/null',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    min_uptime: '60s',
    max_restarts: 20
  }],
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
