  
#!/bin/bash
set -e
user="ec2-user"

rm -rf .git
rm -rf .gitignore
git config --global user.email "anupdhondi5@gmail.com"
git config --global user.name "anupdhondi5@gmail.com"
mv .gitignore_cicd .gitignore
git init .
git add .
git commit -m "Deploying"
git remote add production ssh://$user@$AWS_HOST/~/webapp
git push --force production master

# ssh $user@$AWS_HOST "cd ~/webapp && \
# pm2 kill
# NODE_ENV=production pm2 start /home/ubuntu/webapp/server/build/server.js
# exit"