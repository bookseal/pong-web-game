FROM --platform=linux/amd64 python:3.9-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    locales \
    curl \
    # software-properties-common \
    && rm -rf /var/lib/apt/lists/* \
    && locale-gen en_US.UTF-8

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

RUN pip install web3 py-solc-x
COPY . /app/

EXPOSE 8000