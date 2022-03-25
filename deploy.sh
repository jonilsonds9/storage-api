#!/bin/bash
set -e

function log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')]${*}"
}

function check_production_settings() {
  log "[local] Verificando se o arquivo 'ecosystem.config.js' está configurado corretamente"
  script="./check-prod-settings.js"
  output=$("$script")

  if [ -n "$output" ]; then
      echo "$output"
      exit
  fi
}

function send_production_settings() {
  check_production_settings
  log "[local] Enviando arquivo 'ecosystem.config.js' para o host com IP: $2"
  scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i "$1" ecosystem.config.js ubuntu@"$2":~/
}

function remote_scripts() {
    log "[remote] Removendo pasta do projeto"
    rm -rf storage-api

    log "[remote] Atualizando pacotes"
    sudo apt update

    log "[remote] Instalando Nginx e Git"
    sudo apt install nginx git -y

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

    log "[remote] Fazendo clone do projeto"
    git clone https://github.com/jonilsonds9/storage-api.git storage-api && cd storage-api

    log "[remote] Instalando dependencias do package.json"
    npm install

    log "[remote] Fazendo build do projeto"
    nest build

    log "[remote] Iniciando aplicação em produção"
    pm2 start

    log "[remote] Salvando configurações do pm2 para quando ele reiniciar"
    pm2 save --force

    log "[remote] Copiando configuração do Nginx"
    sudo cp nginx.conf /etc/nginx/sites-available/default

    log "[remote] Reiniciando Nginx para aplicar alterações"
    sudo service nginx restart
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

send_production_settings "$key" "$ip"
run_remote "$key" "$ip"


