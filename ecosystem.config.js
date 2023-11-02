module.exports = {
    apps: [{
        name: 'bakers-server',
        script: './bin/www',
        time: true,
        env: {
            NODE_ENV: 'local',
        },
        env_production: {
            NODE_ENV: "prod",
        }
    }]
}