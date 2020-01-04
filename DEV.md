# Development on linux or windows subsystem for linux

* Install yarn
	* https://yarnpkg.com/lang/en/docs/install/#debian-stable
* Install npm
	* sudo apt install npm
* Install node deps
	* cd frontend
	* npm i
* sudo apt install python3 python3-pip ipython
* optionally install something to separate packages and python version for various python installations/projects:
	* sudo apt install virtualenv
	* optionally configure project to use virtualenv
* pip install -r backend/requirements.txt
* install mariadb
* connect to mariadb and create database liquidator
* configure the database in settings.py (local settings doesn't seem to take effect):
'ENGINE': 'django.db.backends.mysql',
'NAME': 'liquidator',
'USER': 'root',
'PASSWORD': 'ffvii',
'HOST': '127.0.0.1',
'PORT': 3306,
* In frontend/src/mithochondria/index.ts, update BASE_URL so we can use a proxy and avoid nginx:
	* 'http://localhost:3000/api';
* In the backend folder, run the table setup:
	* python3 manage.py makemigrations
* In the backend folder, run the python server:
	* python3 manage.py runserver
* In the frontend folder, find package.json and add a proxy to the backend so you don't need nginx:
	* "proxy": "http://localhost:8000"
* In the frontend folder, start the frontend (port 3000):
	* yarn start
