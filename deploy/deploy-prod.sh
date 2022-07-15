#!/bin/bash

function deploy() {
  ssh_key=$1
  ip_prod=$2
  folder="storage-api"

  # remover checkout e pull
  ssh -i "$ssh_key" ubuntu@"$ip_prod" "
    rm -rf $folder &&
    git clone https://github.com/jonilsonds9/storage-api.git $folder &&
    cd $folder &&
    sh deploy/app-prod.sh $folder
  "

  echo "Url de prod: http://$ip_prod"
}

while getopts k:i: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        i) ip=${OPTARG};;
        *) echo 'Opção inválida!' && exit ;;
    esac
done

echo "Iniciando o deploy em produção"

deploy "$key" "$ip"