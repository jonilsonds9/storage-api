#!/usr/bin/env node
const fs = require('fs');

const rules = [
    {
        variable: ['name'],
        customValue: (value, newValue) => value = newValue,
    },
    {
        variable: ['APP_PORT'],
        customValue: (value, newValue) => value = newValue,
    }
];

(function checkFile() {
    const file = './ecosystem.config.js';
    const allFileContents = fs.readFileSync(file, 'utf-8');

    const appName = process.argv[2];
    const appPort = process.argv[3];

    const result = allFileContents.replace(/'app'/, `'${appName}'`).replace(/3000/, appPort);

    fs.writeFile(file, result, 'utf-8', function (err) {
        if (err) return console.log(err);
    });
})();