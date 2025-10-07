# Backend server

> A backend service app for splitting cuts of original plates using Django-based RabbitMQ, Celery, FFmpeg, and PaddleOCR.

## 📃Description

- This project started from the idea of centralizing VFX production pipeline technologies provided by the Pipeline Team that do not depend on any DCC.
- The project codebase is a Python Django app built applying Clean Architecture.
- By using the provided endpoints, it aims for standardization of functionality usage, unified management, and performance improvements.

## 📑Table of Contents

- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Deploy](#deploy)
- [Tests](#tests)

## 🔗Dependencies

- The Backend server project performs all dependency installation and execution only inside Docker containers to prevent pollution of the developer's local environment.
- Developers do not install any language or package manager such as Python, Poetry, Node.js directly on the local host.
- Various dependencies and environment settings are defined in the files below.

  - [Dockerfile](./Dockerfile): Defines container build and runtime environment
  - [docker-compose.yml](./docker-compose.yml): Service orchestration and volume/network configuration
  - [pyproject.toml](./pyproject.toml): Python, Django dependencies and Poetry settings
  - [package.json](./package.json): Node.js based tool dependencies

- Required installed programs (local):
  - Docker
  - Docker Compose

#### ⚠️Warning

> Python and Poetry are used only inside the container, and developers do not install them separately on local.
> If developers install required dependencies directly on their local environments, environment pollution and version conflicts can occur, so development and testing must be conducted through the container environment.

## 📥Installation

- Runs based on Docker containers and can be executed using the usage guide below without local Python dependencies.

#### certs git submodule Initialization

- Uses git@gitlab.domain.com:some-where/certs.git as a submodule.

```shell
❯ git submodule update --init --recursive
```

- Update submodule to latest commit (if needed)

```shell
❯ git submodule update --remote certs
❯ git add certs
❯ git commit -m "Update certs submodule to latest"
❯ git push
```

## 👨‍💻Usage

#### 1. Image build

```shell
❯ docker compose --profile server build
```

#### 2. Start container

- The profile that must be run differs per host.
- On the TEST1 server only the `nginx`, `backend-server` services are run.

```shell
❯ docker compose --profile server up -d
```

- On the TEST2 server only the `platform-db` service is run.

```shell
❯ docker compose --profile db up -d
```

#### 3. Model migration

```shell
❯ docker compose run --rm backend-server python manage.py makemigrations your_app_name
```

- For the DMS app

```shell
❯ docker compose run --rm backend-server python manage.py makemigrations DMS
```

#### 4. Regenerate poetry.lock for dependencies consistency

```shell
❯ docker compose --profile server run --rm backend-server poetry lock
```

#### 5. Install dev dependencies

- Install dev group dependencies into the running backend-server container

```shell
❯ docker compose run --rm backend-server poetry install --with dev --no-root
```

## 🚀Deploy

- Deployment is executed in the order dev merge > staging > main after merging the working branch.
- After merging dev > staging, deployment to the staging environment proceeds automatically.
- After merging staging > main, deployment to the production environment proceeds automatically.
- Manual deployment and rollback are possible using backend-server>Build>Pipelines>New pipeline.
- For details, refer to [.gitlab-ci.yml](./.gitlab-ci.yml) and the .gitlab-ci folder.

## 🧪Tests

- Tests are written under the `tests` folder and executed with the commands below.
- To test the entire tests folder

```shell
❯ docker compose run --rm backend-server python manage.py test
```

- To test by specific functionality

```shell
❯ docker compose run --rm backend-server python manage.py test tests.DMS.integration.setdata
```

## ✍️Authors

- Kim Kang Min <cgextra@daum.net>
