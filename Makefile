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
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: makemigrations
makemigrations:
	docker-compose exec web python /code/manage.py makemigrations

.PHONY: migrate
migrate: makemigrations
	docker-compose exec web python /code/manage.py migrate

.PHONY: makemigrations
createsuperuser:
	docker-compose exec web python /code/manage.py createsuperuser

.PHONY: startapp
startapp:
	docker-compose exec web python /code/manage.py startapp $(APP)

.PHONY: update
update:
	docker-compose exec web pip install -r /code/requirements.txt

.PHONY: test
test:
	docker-compose exec web python /code/manage.py test

.PHONY: shell
shell:
	docker-compose exec web python /code/manage.py shell

.PHONY: flake
flake:
	docker-compose exec web flake8
