module.exports = {
  apps: [{
    name: 'command-builder',
    script: 'server-production.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      HOST: 'localhost'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3300,
      HOST: '0.0.0.0'
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced PM2 features
    min_uptime: '10s',
    max_restarts: 10,
    
    // Graceful shutdown
    kill_timeout: 5000,
    
    // Health monitoring
    health_check_grace_period: 3000
  }]
};
