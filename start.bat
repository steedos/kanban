set DB_SERVER=192.168.0.150
set MONGO_URL=mongodb://%DB_SERVER%/steedos
set MONGO_OPLOG_URL=mongodb://%DB_SERVER%/local
set MULTIPLE_INSTANCES_COLLECTION_NAME=workflow_instances

set ROOT_URL=http://192.168.0.53:6666/
meteor run -p 6666 --settings settings.json
