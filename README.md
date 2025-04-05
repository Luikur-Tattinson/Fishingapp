## Register and add new fishing catches to the database including, but not limited to images, map location and automatic weather retrieval


## Tech stack

### Backend
Language and framework: Python & [Django](https://www.djangoproject.com/)
Authentication: JWT
Asynchronous processing: [Celery](https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html) + [Redis](https://redis.io/)
Caching: Redis
API Communication: REST
Database: [PostgreSQL](https://www.postgresql.org/)

### Frontend
Language: [React js](https://react.dev/)
State management: [Redux](https://redux.js.org/) & [React Query](https://tanstack.com/query/latest)
Maps: [Leaflet](https://leafletjs.com/)
Weather API: [Open-meteo](https://open-meteo.com/)

## How to run

## With Docker
Run `docker-compose up` inside the project directory
Run `npm start` inside the frontend folder

## Without Docker
Setup a PostgreSQL database and create the required databases
Install and run Redis locally
Create a Python virtual environment and install all dependencies from requirements.txt
Configure environment variables
Run: `python manage.py migrate`
Run: `python manage.py runserver`
Run celery: `celery -A fishingapp worker --loglevel=info`
