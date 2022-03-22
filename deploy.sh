#!/bin/bash
set -e

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')]${*}"
}

function run_local() {
  log "[local] Removendo arquivo 'deploy.tar.gz' se existir"
  [ -e deploy.tar.gz ] && rm deploy.tar.gz

  log "[local] Copiando arquivos necessários para a pasta 'dist'"
  cp package*.json ecosystem.config.js nginx.conf dist

  log "[local] Entrando na pasta 'dist' e gerando arquivo 'tar.gz'"
  cd dist && tar czf ../deploy.tar.gz * && cd ..
}

function send_to_remote() {
  log "[local] Enviando arquivo para o host com IP: $2"
  scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i "$1" deploy.tar.gz ubuntu@"$2":~/
}

function remote_scripts() {
    log "[remote] Removendo pasta do projeto"
    rm -rf storage-api

    log "[remote] Atualizando pacotes"
    sudo apt update

    log "[remote] Instalando Nginx"
    sudo apt install nginx -y

    log "[remote] Instalando Nvm (Gerenciador de versões do Node)"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

    log "[remote] Fazendo reload das configurações do Usuário"
    source "$HOME"/.nvm/nvm.sh

    log "[remote] Instalando Node versão 16.14.0"
    nvm install 16.14.0 && nvm alias default 16.14.0

    log "[remote] Instalando pm2 globalmente"
    npm install pm2@5.2.0 -g

    log "[remote] Adicionando o pm2 no path para iniciar junto com sistema"
    sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.14.0/bin /home/ubuntu/.nvm/versions/node/v16.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

    log "[remote] Instalando CLI do NestJS globalmente"
    npm install @nestjs/cli@8.2.3 -g

    log "[remote] Criando pasta e extraindo arquivos"
    mkdir storage-api && tar -xf deploy.tar.gz -C storage-api && cd storage-api

    log "[remote] Instalando dependencias do package.json"
    npm install

    log "[remote] Iniciando aplicação em produção"
    pm2 start

    log "[remote] Salvando configurações do pm2 para quando ele reiniciar"
    pm2 save --force

    log "[remote] Copiando configuração do Nginx"
    sudo cp nginx.conf /etc/nginx/sites-available/default

    log "[remote] Reiniciando Nginx para aplicar alterações"
    sudo service nginx restart

    log "[remote] Removendo arquivo de deploy"
    cd .. && rm deploy.tar.gz
}

function run_remote() {
  log "[remote] Fazendo SSH no host com IP: $2"
  ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i "$1" ubuntu@"$2" "$(declare -f log remote_scripts); remote_scripts"
}

while getopts k:i: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        i) ip=${OPTARG};;
        *) echo 'Opção inválida!' && exit ;;
    esac
done

run_local
send_to_remote "$key" "$ip"
run_remote "$key" "$ip"


