#!/bin/bash

BRANCH=$1 # Use chave se for mais de 1 digito ${12}
APP_PORT=$2

sudo rm "/etc/nginx/sites-available/homolog/$BRANCH.conf" 2> /dev/null

echo "
location /$BRANCH {
    proxy_pass http://127.0.0.1:$APP_PORT/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
}
" >> "/etc/nginx/sites-available/homolog/$BRANCH.conf"

systemctl reload nginx