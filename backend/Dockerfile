FROM python:3.7-slim

ENV PYTHONUNBUFFERED 1

RUN useradd django -u 1000 -U -s /bin/false

WORKDIR /backend/code

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . ./

RUN ./manage.py collectstatic --no-input

EXPOSE 8000

USER django

CMD ["gunicorn", "--chdir", "liquidator", "--bind", ":8000", "liquidator.wsgi:application"]
