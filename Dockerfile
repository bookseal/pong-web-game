FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    postgresql-client \
    openssl \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && locale-gen en_US.UTF-8

COPY requirements.txt /app
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app

RUN mkdir -p /app/staticfiles

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost"

COPY nginx.conf /etc/nginx/sites-available/default

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD gunicorn --bind 0.0.0.0:8000 pong_project.wsgi:application & nginx -g 'daemon off;'
