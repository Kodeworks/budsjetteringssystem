NGINX_TEST_PORT=8839

COMPOSE=docker-compose
COMPOSE_PROD=$(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml
TEST_BASE_URL=http://nginx:80/api
TEST_PROJECT=liquidator-test
FRONTEND_RUN=$(COMPOSE) run --rm frontend
FRONTEND_TEST_PROJECT=$(COMPOSE) --project-name=$(TEST_PROJECT)
FRONTEND_TEST_EXEC=$(FRONTEND_TEST_PROJECT) exec -e REACT_APP_BASE_URL=$(TEST_BASE_URL) frontend
FRONTEND_TEST_RUN=$(FRONTEND_TEST_PROJECT) run --rm -e REACT_APP_BASE_URL=$(TEST_BASE_URL) frontend

BACKEND_RUN=$(COMPOSE) run --rm backend
BACKEND_MANAGE=$(BACKEND_RUN) python manage.py
PROD_BACKEND_MANAGE=$(COMPOSE_PROD) run --rm backend python manage.py


.PHONY: all
all: migrate up

.PHONY: prod
prod: build prod-migrate
	$(COMPOSE_PROD) up

.PHONY: prod-background
prod-background: build prod-migrate
	$(COMPOSE_PROD) up -d

.PHONY: prod-down
prod-logs:
	$(COMPOSE_PROD) logs

.PHONY: prod-down
prod-down:
	$(COMPOSE_PROD) down

.PHONY: build
build:
	$(COMPOSE) build

.PHONY: up
up:
	$(COMPOSE) up

.PHONY: background
background:
	$(COMPOSE) up -d

.PHONY: stop
stop:
	$(COMPOSE) stop

.PHONY: down
down:
	$(COMPOSE) down

.PHONY: logs
logs:
	$(COMPOSE) logs

.PHONY: test
test: test-backend test-frontend-all


### FRONTEND ###
.PHONY: tslint
tslint:
	$(FRONTEND_RUN) tslint -p . $(YCMD)

.PHONY: test-frontend
test-frontend:
	$(FRONTEND_RUN) yarn test $(YCMD)

.PHONY: test-frontend-api
test-frontend-api:
	NGINX_PORT=$(NGINX_TEST_PORT) $(FRONTEND_TEST_PROJECT) up -d
	$(FRONTEND_TEST_PROJECT) exec backend python manage.py migrate
	$(FRONTEND_TEST_PROJECT) exec backend python manage.py flush --no-input
	$(FRONTEND_TEST_RUN) yarn test:api $(YCMD)
	$(FRONTEND_TEST_PROJECT) logs
	$(FRONTEND_TEST_PROJECT) stop

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

.PHONY: prod-migrate
prod-migrate:
	$(PROD_BACKEND_MANAGE) migrate $(DCMD)

.PHONY: createsuperuser
createsuperuser:
	$(BACKEND_MANAGE) createsuperuser $(DCMD)

.PHONY: startapp
startapp:
	$(BACKEND_MANAGE) startapp $(APP) $(DCMD)

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
