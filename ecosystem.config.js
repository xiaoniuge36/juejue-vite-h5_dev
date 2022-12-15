module.exports = {
  apps: [
    {
      name: 'juejue-vite-h5_dev',
      script: 'juejue-vite-h5-server.js'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '116.204.107.20',
      ref: 'origin/main',
      repo: 'git@github.com:xiaoniuge36/juejue-vite-h5_dev.git',
      path: '/project/juejue-vite-h5_dev',
      'post-deploy': 'git reset --hard && git checkout main && git pull && npm i --production=false && pm2 startOrReload ecosystem.config.js', // 
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}