# django_react_starter_app

This is a basic skeleton of a django rest framework app with react frontend. 

Setup steps:
1. Create a virtualenv
2. pip install -r requirements.txt
3. Install Node.js
4. npm install --production=false
5. Create a .env file in the root directory with all of the database parameters and secret key etc. 
6. python manage.py migrate
7. python manage.py runserver


The frontend uses the MaterialUI react package. All undefined url paths end up serving the frontend index view. This frontend index view has the root element that react mounts to. 

The authentication backend is the default Django sessions backend. All of the authentication code is in the "account" folder. With the django sessions backend the session id is stored in the session cookie. 

The frontend sends the csrftoken as a header in all requests. It gets the csrftoken from the csrftoken cookie. 
