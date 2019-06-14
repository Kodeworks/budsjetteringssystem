.PHONY: all
all: run

.PHONY: build
build:
	docker build .

.PHONY: run
run:
	docker-compose up

.PHONY: up
up:
	docker-compose up -d --build

.PHONY: down
down:
	docker-compose down

.PHONY: makemigrations
makemigrations:
	docker-compose run web python /code/manage.py makemigrations

.PHONY: migrate
migrate: makemigrations
	docker-compose run web python /code/manage.py migrate

.PHONY: makemigrations
createsuperuser:
	docker-compose run web python /code/manage.py createsuperuser

.PHONY: startapp
startapp:
	docker-compose run web python /code/manage.py startapp $(APP)

.PHONY: update
update:
	docker-compose run web pip install -r /code/requirements.txt

.PHONY: test
test:
	docker-compose run web python /code/manage.py test
