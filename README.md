# tapp
[![Build Status](https://travis-ci.org/uoft-tapp/tapp.svg?branch=master)](https://travis-ci.org/uoft-tapp/tapp)

TA assignment and matching application.

## Structure
The Dockerfile serves instructions to set up the image of the container (linux, yarn, npm etc)
The docker-compose files serves to setup the services that your container will be using (postgres, apache, nginx, apps)
The [prod|dev].env.default files are served to the Dockerfile and the docker-compose files.

## Deployment instructions

```
git clone git@github.com:uoft-tapp/tapp.git #this repo

To deploy to production (Lloyd)
cp prod.env.default .env

To work in development
cp dev.env.default .env

docker-compose run rails-app rake db:migrate db:seed db:seed:chass[mock_chass]    #only for today, August 1
docker-compose up


If you don't specify the environment variable that the docker-compose file should reference, you might end
up with an error from postgres ("role "tapp" does not exist"). In that case stop/remove the containers and its volumes,
docker-compose down -v

Copy over the appropriate environment variables, then start the build from stratch
docker-compose build rails-app

& finally docker-compose up.

```

## Starting application
You should have a reasonably recent version of Docker
[installed](https://docs.docker.com/engine/installation/). Also, check that
you have Docker Compose installed.

Copy the `dev.env.default` file to `.env`.  This file is where the docker components
will pickup environment variables such as the postgres username and password.

```
cp dev.env.default .env
```

Once that's out of the way, clone this repo, navigate into the cloned
directory, and run

```
docker-compose up
```

In a new tab, open http://localhost:3000 to see the Rails welcome page!

On the technical side, `docker-compose up` launched two containers: `rails-app`
and `webpack-dev-server`. The former runs the Rails app, while the latter
watches and compiles React files located in `app/javascript/packs`.

## Trying things out
Application code is linked into containers with live reloading, so you can
see changes you make locally right away!

You have full control over Rails code, apply the usual methods. Check the next
section for details on running commands like `rake …` and `rails …`.

To get you started with React quicker, this app comes preloaded with a simple
React app. Visiting http://localhost:3000/hello_react will load JavaScript code
located in `app/javascript/packs/hello_react.jsx`.

## Running commands
To run any `bundle …`, `rails …`, `rake …`, or `yarn …` commands, launch them
via `rails-app` service. For example, `rails generate controller Welcome` is
```
docker-compose run rails-app rails generate controller Welcome
```

## Testing
This app comes pre-loaded with a testing framework for the Ruby parts,
[rspec-rails](https://github.com/rspec/rspec-rails). You can run all tests
like so:
```
docker-compose run rails-app rake spec
```
Tests are located in `spec/controllers`, `spec/models`, and `spec/routing`.

A test autorunner, [guard](https://github.com/guard/guard), will watch changes
to your files and run applicable tests automatically. When developing, start
it with
```
docker-compose run rails-app guard
```

## Dependencies
Ruby/Rails and JavaScript dependencies are checked on container start. Any
unmet dependencies will be installed automatically for the current container.

To add a Ruby/Rails dependency, modify `Gemfile` and (re-)start `rails-app`
service, `docker-compose up` or `docker-compose restart rails-app`.

To add a JavaScript dependency, use Yarn:  
```
docker-compose run rails-app yarn add <package-name>
```  
and restart `webpack-dev-server` service.

To add a system dependency, modify the Dockerfile.

## In case of container trouble

Try `docker-compose down`, then `docker-compose up`. This should delete
existing images for this project and rebuild them from scratch.

## TODO
- [] JavaScript testing
