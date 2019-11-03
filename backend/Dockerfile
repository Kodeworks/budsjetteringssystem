FROM python:3.7-slim

ARG PROD
ARG DJANGO_SECRET_KEY

ENV PYTHONUNBUFFERED 1

RUN useradd django -u 1000 -U -s /bin/false

WORKDIR /backend/code

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . ./

RUN python manage.py collectstatic --no-input

USER django
