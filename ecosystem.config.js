module.exports = {
    apps: [{
        name: 'bakers-server',
        script: './bin/www',
        time: true,
        log_date_format: "MM-DD hh:mm:ss.SSS +09:00"
        env: {
            NODE_ENV: 'local',
        },
        env_production: {
            NODE_ENV: "prod",
        }
    }]
}