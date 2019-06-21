[![CircleCI](https://circleci.com/gh/Kodeworks/liquidator-backend.svg?style=svg)](https://circleci.com/gh/Kodeworks/liquidator-backend)

# Liquidator backend

[API spesification](https://app.swaggerhub.com/apis/kw-liquidator/Liquidator/1.0.0#/)

[Frontend](https://github.com/Kodeworks/liquidator-frontend)

## Setup

### With docker

* NOTE: Docker commands have to be run as root on linux, unless you are a member of the `docker` group

A Dockerfile and docker-compose file have been provided so that
running the server is easy and predictable. To use this, install docker (and docker-compose on linux).

A Makefile is provided with aliases for useful commands:

	# Create the server. Has to be run before any other commands
	make build

	# Start the server
	make

	# Start and stop the server in the background
	make up
	make down

	## The following require that the server is running

	# Handle migrations
	make makemigrations
	make migrate

	# Run unit-tests
	make test

	# Update pip requirements (after changing requirements.txt)
	make update

	# Create a new app
	make startapp APP=<app name>

When the docker container is running any changes to the source files are synced to the container, and django reloads them automatically. Therefore the server doesn't have to be restarted after a change.

Migrations created in the container are synced back to the source tree, and should be added to git.

### Without docker

The server can be run as a normal django server, but then you have to install a database manually.
The django settings can be overriden by creating the file `liquidator/local_settings.py` and overriding any variables set in `settings.py`.
