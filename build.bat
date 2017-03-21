meteor build --server https://cn.steedos.com/kanban --directory C:/srv/kanban --allow-superuser
cd C:/srv/kanban/bundle/programs/server
rm -rf node_modules
rm -f npm-shrinkwrap.json
npm install --registry https://registry.npm.taobao.org -d

cd C:/srv/kanban/
pm2 restart kanban.0
