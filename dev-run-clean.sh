#!/bin/bash

die(){
	echo $*
	exit 2
}

# start up tapp for development 

docker-compose ps

echo 'have you shut down containers already with docker down?'
echo 'you should consider down -v to remove the postgres volume. hit enter to continue'
read -p 'hit enter to continue: [interrupt to quit]: '

read -p 'hit enter to cp dev.env.devfault .env : ' JUNK

set -x
cp dev.env.default .env || die failed to copy dev.env.default
set -

read -p 'enter to `docker rm -f` your containers: ' JUNK
set -x
docker-compose rm -f  || die docker-compose rm -f failed
set -

set -x
docker-compose up -d --force-recreate || die docker-compose up --force-recreate failed
set -


