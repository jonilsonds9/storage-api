#!/bin/bash

function deploy() {
  branch=$1
  ssh_key=$2
  ip_homolog=$3
  random_port=$4

  folder="${branch,,}"

  ssh -i "$ssh_key" ubuntu@"$ip_homolog" "
    rm -rf homolog/$folder &&
    mkdir -p homolog &&
    cd homolog &&
    git clone https://github.com/jonilsonds9/storage-api.git $folder &&
    cd $folder &&
    git checkout $branch &&
    git pull &&
    sudo sh deploy/nginx-homolog.sh $branch $random_port &&
    sh deploy/app-homolog.sh $branch $random_port
  "

  echo "Url de homolog: http://$ip_homolog/$branch"
}

while getopts b:k:i: flag
do
    case "${flag}" in
        b) branch=${OPTARG};;
        k) key=${OPTARG};;
        i) ip=${OPTARG};;
        *) echo 'Opção inválida!' && exit ;;
    esac
done

echo "Iniciando o deploy em homolog da branch $branch"

function random_port() {
  RANGE=$(( 4000 - 3000 + 1 ))
  RESULT=$(($(($RANDOM % $RANGE )) + 3000))
  echo "$RESULT"
}

deploy "$branch" "$key" "$ip" "$(random_port)"