module.exports = {
  apps: [
    {
      name: 'uc-rs-tidar',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
        HOST: '0.0.0.0',
      },
    },
  ],
};

