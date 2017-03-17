#!/bin/bash
meteor npm install
meteor build --server https://cn.steedos.com/board --directory /srv/wekan --allow-superuser
cd /srv/wekan/bundle/programs/server
rm -rf node_modules
rm -f npm-shrinkwrap.json
npm install --registry https://registry.npm.taobao.org -d

cd /srv/wekan/
pm2 restart wekan.0
