.PHONY: help build up down dev prod logs restart clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker-compose build

up: ## Start containers in production mode
	docker-compose up

up-d: ## Start containers in background (production)
	docker-compose up -d

down: ## Stop and remove containers
	docker-compose down

dev: ## Start in development mode with hot reload
	docker-compose -f docker-compose.dev.yml up

dev-d: ## Start in development mode (background)
	docker-compose -f docker-compose.dev.yml up -d

prod: ## Build and start in production mode
	docker-compose up --build

prod-d: ## Build and start in production mode (background)
	docker-compose up --build -d

logs: ## View logs
	docker-compose logs -f

restart: ## Restart containers
	docker-compose restart

clean: ## Remove containers, volumes, and images
	docker-compose down -v
	docker image prune -f

rebuild: ## Rebuild from scratch
	docker-compose down -v
	docker-compose build --no-cache
	docker-compose up

shell: ## Open shell in container
	docker-compose exec app sh

status: ## Show container status
	docker-compose ps

install: ## Install dependencies locally
	yarn install

dev-local: ## Run development server locally (no Docker)
	yarn dev

build-local: ## Build locally (no Docker)
	yarn build
