---
title: How to deploy your Node project to AWS EC2 easily
date: '2018-10-21T16:51:00.000Z'
layout: post
draft: false
path: '/2018/10/21/how-to-deploy-your-node-project-to-aws-ec2-easily/'
category: 'Web Development'
tags:
  - 'AWS'
  - 'Web Development'
description: 'Easy Proof of Concept for deploying Node.js apps from your own machine.'
---

### Create an AWS EC2 instance

Create an AWS EC2 instance
Log into AWS and create an account if you don’t have one already. Log in and you should see your dashboard, or a list of services.

![AWS](./6-a.png)

Select EC2. Then select Launch Instance.

If you’re just prototyping a simple website then choosing the latest Ubuntu Server image is fine. Make sure to save your private key somewhere safe.

### Connecting to your EC2 instance

Test your new EC2 instance by connecting to it.

```sh
$ ssh -i keyname.pem user@your-ec2-address
```

Or press the Connect button while on your EC2 console for exact instructions.

Your ec2 address looks something like ec2-55-55-555-55.xx-yyyy-5.compute.amazonaws.com

### Copy your git repo to your EC2 instance

```sh
scp -i yourkey.pem -r yourproject your-user@your-ec2-address:~
```

If you chose the Ubuntu Server image, your user isubuntuby default. Don’t forget the :~ at the end.

### Configure your “push” git repo on AWS

```sh
$ ssh -i yourkey.pem -your-user@your-ec2-address
$ git clone --bare yourproject yourproject.git
```

You now have a copy of the git repo you originally pushed. Now configure your original to pull from it.

```
$ cd yourproject
$ git remote set-url origin ../yourproject.git
```

### Configure your local repository to push to your AWS repo

Add the following your ssh config

```sh
Host aws
HostName your-ec2-address
User ubuntu
IdentityFile /home/you/.ssh/yourkey.pem # or preferably somewhere much safer
IdentitiesOnly yes
```

Now set your local repository to also push to your AWS repository

```sh
git remote set-url --add --push origin aws:yourproject.git
```

### Deployment scripts

Use scripts to bootstrap your application

```sh
$ cd yourproject
$ mkdir deploy
$ cd deploy
$ touch deploy.sh runner.sh
```

_deploy.sh_

```sh
#!/bin/bash
set -e

### Configuration

### Change me!

USER=ubuntu
SERVER=$USER@your-ec2-address
REMOTE_SCRIPT_PATH=/tmp/runner.sh
APP_DIR=~/yourproject
GIT_URL=~/yourproject.git
IDENTITY_FILE=yourkey.pem

function run()
{
echo "Running: $@"
"$@"
}

### Automation steps

run scp -i deploy/$IDENTITY_FILE deploy/runner.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on remote server ----"
run ssh -i $IDENTITY_FILE $SERVER bash $REMOTE_SCRIPT_PATH

runner.sh-

#!/bin/bash

set -e

### Configuration

### Change me for your app!

APP_DIR=~/yourproject
GIT_URL=~/yourproject.git
USER=ubuntu

set -x

# Pull latest code

if [[ -e $APP_DIR ]]; then
cd $APP_DIR
git pull
else
git clone $GIT_URL $APP_DIR
cd $APP_DIR/
fi

# Install dependencies

npm install --production
npm prune --production

# Start your app

# I like to run it in a tmux session so I can view logging if necessary

set +e
if tmux info &> /dev/null; then
tmux kill-session -t "yourproject"
fi
set -e

tmux new-session -d -s "yourproject" "npm run prod"
```

Add a npm script for easy usage

_package.json_

```js
{
"name": "yourproject",
"version": "0.0.0",
"scripts": {
"start": "node ./bin/www",
"prod": "export NODE_ENV=production && node ./bin/www",
"dev": "export NODE_ENV=development && node ./bin/www",
"deploy": "bash deploy/deploy.sh"
...
}
```

## Commit and push everything

```sh
git add package.json deploy/runner.sh deploy/deploy.sh
git commit -m 'Add deployment scripts'
git push origin master
```

## Deploy!

```sh
npm run deploy
```
