FROM python:3.13-alpine
LABEL maintainer="Kim Kang Min"

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=2.1.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false

RUN apk add --no-cache \
    curl \
    postgresql-client \
    linux-headers \
    && apk add --no-cache --virtual .build-deps \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-dev \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry

WORKDIR /backend-server
COPY ./pyproject.toml ./poetry.lock* ./

ARG DEV=false

RUN if [ "$DEV" = "false" ]; then \
    poetry install --no-interaction --no-ansi --no-root --without dev; \
    else \
    poetry install --no-interaction --no-ansi --no-root; \
    fi

COPY ./ /backend-server

RUN python manage.py collectstatic --noinput
