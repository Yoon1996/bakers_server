module.exports = {
    apps: [{
        name: 'bakers-server',
        script: './bin/www',
        time: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        env: {
            NODE_ENV: 'local',
        },
        env_production: {
            NODE_ENV: "prod",
        }
    }]
}