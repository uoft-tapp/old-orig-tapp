#!/bin/bash

die(){
	echo $*
	exit 2
}

# start up tapp for production 

echo 'have you shut down containers already with docker down?'
echo 'you should consider down -v to remove the postgres volume. hit enter to continue'
read -p 'hit enter to continue: [interrupt to quit]: '

read -p 'enter to cp prod.env.devfault .env :' JUNK
cp prod.env.default .env

read -p 'enter to `docker rm -f` your containers: ' JUNK
docker-compose rm -f  || die docker-compose rm -f failed

docker-compose up -d --force-recreate || die docker-compose up --force-recreate failed

#actually all that is needed here is a sleep.. but how long?
read -p 'enter to `seed postgres db: ' JUNK

docker-compose run rails-app rake db:migrate db:seed  || die "rake db:migrate db:seed failed"


