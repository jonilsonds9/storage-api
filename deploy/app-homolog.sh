#!/bin/bash

BRANCH=$1 # Use chave se for mais de 1 digito ${12}
APP_PORT=$2

cp /home/ubuntu/ecosystem.config.js "/home/ubuntu/homolog/$BRANCH"

printf "Current directory: %s \n" "$(pwd)"
printf "Node Version: %s \n" "$(node -v)"

node deploy/config-pm2-homolog.js "$BRANCH" "$APP_PORT"

# Use o npm install se precisar atualizar as deps
# npm install

cp -r /home/ubuntu/node_modules "/home/ubuntu/homolog/$BRANCH/node_modules"

npm run build

pm2 start
pm2 save --force