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

read -p 'enter to cp dev.env.devfault .env : ' JUNK
cp dev.env.default .env || die failed to copy dev.env.default

read -p 'enter to `docker rm -f` your containers: ' JUNK
docker-compose rm -f  || die docker-compose rm -f failed

docker-compose up -d --force-recreate || die docker-compose up --force-recreate failed

#actually all that is needed here is a sleep to wait for postgress to come up.. but how long?
read -p 'enter to `seed postgres db:' JUNK
docker-compose run rails-app rake db:migrate db:seed  || die "rake db:migrate db:seed failed"

#read -p 'enter to migrate mock chass data? [interrupt to quit, in which case tapp db will be seeded, but empty]' JUNK
#docker-compose run rails-app rake db:migrate 'db:seed:chass[mock_chass.json]'
