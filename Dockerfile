FROM python:3.7-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN pip install -r /code/requirements.txt
