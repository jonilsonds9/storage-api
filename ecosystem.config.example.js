module.exports = {
    apps: [
        {
            name: 'app',
            script: './main.js',
            watch: false,
            force: true,
            env: {
                NODE_ENV: 'production',

                ACCESS_KEY: '',

                DB_HOST: '',
                DB_PORT: 3306,
                DB_USER: 'admin',
                DB_PASSWORD: '',
                DB_DATABASE: 'storageapi',

                AWS_REGION: 'sa-east-1',
                AWS_BUCKET_NAME: '',
                AWS_ACCESS_KEY_ID: '',
                AWS_SECRET_ACCESS_KEY: ''
            },
        },
    ],
};