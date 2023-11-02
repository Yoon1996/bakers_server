module.exports = {
    apps: [{
        name: 'bakers-server',
        script: './bin/www',
        env: {
            NODE_ENV: 'local',
            time: true,
        },
        env_production: {
            NODE_ENV: "prod",
            time: true,
        }
    }]
}