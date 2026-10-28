.PHONY: help up down logs test-docker install start test lint build

help:
	@echo "make up           construye y sirve la aplicacion con Docker en http://localhost:8080"
	@echo "make logs         muestra los logs del contenedor"
	@echo "make down         para y elimina el contenedor"
	@echo "make test-docker  pasa el lint y los tests dentro de Docker (no necesita Node)"
	@echo "make install      instala las dependencias en local (Node 22.22+ o 24.15+)"
	@echo "make start        arranca el servidor de desarrollo en local"
	@echo "make test         ejecuta los tests en local"
	@echo "make lint         pasa el linter en local"
	@echo "make build        genera la build de produccion en dist/"

up:
	docker compose up -d --build
	@echo "Aplicacion en http://localhost:8080"

down:
	docker compose down

logs:
	docker compose logs -f web

test-docker:
	docker build --target test .

install:
	npm ci

start:
	npm start

test:
	npm test

lint:
	npm run lint

build:
	npm run build
