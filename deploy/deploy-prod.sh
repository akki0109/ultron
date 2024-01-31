#!/bin/bash

DEPLOY_SERVER=$SERVER_IP
#SERVER_FOLDER="html-folder-in-server"
#export PATH=/home/ubuntu/.nvm/versions/node/v16.16.0/bin/npm:$PATH
# Building React output
#npm install --force
#npm run build

echo "Deploying to ${DEPLOY_SERVER}"
#scp -r build/ ubuntu@${DEPLOY_SERVER}:/var/www/angular/
ssh -o StrictHostKeyChecking=no imensoss@${SERVER_IP} "cd /home/imensoss/hrm.imenso.in && git checkout main && git pull origin main && exit"
#scp -r build/* imensoss@${SERVER_IP}:/home/imensoss/hrm.imenso.in/build
echo "Finished copying the build files"

