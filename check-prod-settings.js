#!/usr/bin/env node
const fs = require('fs');

const rules = [
    {
        variable: ['name', 'script', 'DB_PORT', 'DB_USER', 'DB_DATABASE'],
        validation: (value) => value.length > 1,
    },
    {
        variable: ['watch'],
        validation: (value) => value === 'false',
    },
    {
        variable: ['force'],
        validation: (value) => value === 'true',
    },
    {
        variable: ['NODE_ENV'],
        validation: (value) => value === 'production',
    },
    {
        variable: ['ACCESS_KEY', 'DB_HOST', 'DB_PASSWORD', 'AWS_BUCKET_NAME'],
        validation: (value) => value.length > 8,
    },
    {
        variable: ['AWS_REGION'],
        validation: (value) => value.length >= 9,
    },
    {
        variable: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
        validation: (value) => value.length >= 15,
    },
];

(function checkFile() {
    const file = './ecosystem.config.js';
    const allFileContents = fs.readFileSync(file, 'utf-8');

    allFileContents.split(/\r?\n/).forEach(line =>  {
        const [key, value] = line.trim().split(':');
        rules.forEach(rule => {
           if (rule.variable.includes(key)) {
               const isValid = rule.validation(value.trim().replace(/[,]$/, '').replace(/^'|'$/g, ''));
               if (!isValid) console.log(`Variével '${key}' não está preenchida corretamente!`);
           }
        });
    });
})();

