#!/bin/bash

FOLDER=$1 # Use chave se for mais de 1 digito ${12}

cp /home/ubuntu/ecosystem.config.js "/home/ubuntu/$FOLDER"

printf "Current directory: %s \n" "$(pwd)"
printf "Node Version: %s \n" "$(node -v)"

# Use o npm install se precisar atualizar as deps
# npm install

cp -r /home/ubuntu/node_modules "/home/ubuntu/$FOLDER/node_modules"

npm run build

pm2 delete app
pm2 start
pm2 save --force