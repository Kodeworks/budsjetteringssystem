NGINX_TEST_PORT=8839

COMPOSE=docker-compose
TEST_BASE_URL=http://nginx:80/api
FRONTEND_RUN=$(COMPOSE) run frontend
FRONTEND_TEST_PROJECT=$(COMPOSE) --project-name="liquidator-test"
FRONTEND_TEST_EXEC=$(FRONTEND_TEST_PROJECT) exec -e REACT_APP_BASE_URL=$(TEST_BASE_URL) frontend

BACKEND_RUN=$(COMPOSE) run backend
BACKEND_MANAGE=$(BACKEND_RUN) python manage.py


.PHONY: all
all: update-backend migrate up

.PHONY: build
build:
	docker-compose build

.PHONY: up
up:
	docker-compose up

.PHONY: background
background:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose stop

.PHONY: down
down:
	docker-compose down

.PHONY: test
test: test-backend test-frontend-all


### FRONTEND ###
.PHONY: test-frontend
test-frontend:
	$(FRONTEND_RUN) yarn test $(YCMD)

.PHONY: test-frontend-api
test-frontend-api:
	NGINX_PORT=$(NGINX_TEST_PORT) $(FRONTEND_TEST_PROJECT) up -d
	$(FRONTEND_TEST_PROJECT) run backend python manage.py migrate
	$(FRONTEND_TEST_EXEC) yarn test:api $(YCMD)
	$(FRONTEND_TEST_PROJECT) logs
	$(FRONTEND_TEST_PROJECT) rm -s -f

.PHONY: test-frontend-all
test-frontend-all: test-frontend test-frontend-api

.PHONY: test-frontend-logs
test-frontend-logs:
	$(FRONTEND_TEST_PROJECT) logs


### BACKEND ###

.PHONY: makemigrations
makemigrations:
	$(BACKEND_MANAGE) makemigrations $(DCMD)

.PHONY: migrate
migrate:
	$(BACKEND_MANAGE) migrate $(DCMD)

.PHONY: createsuperuser
createsuperuser:
	$(BACKEND_MANAGE) createsuperuser $(DCMD)

.PHONY: startapp
startapp:
	$(BACKEND_MANAGE) $(APP) $(DCMD)

.PHONY: update-backend
update-backend:
	$(BACKEND_RUN) pip install -r requirements.txt $(DCMD)

.PHONY: test-backend
test-backend:
	$(BACKEND_MANAGE) test $(DCMD)

.PHONY: shell
shell:
	$(BACKEND_MANAGE) shell $(DCMD)

.PHONY: flake
flake:
	$(BACKEND_RUN) flake8 $(DCMD)
