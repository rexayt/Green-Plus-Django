 FROM python:3.12.3-slim-bullseye
 WORKDIR /app
 
 ENV PYTHONUNBUFFERED 1
 ENV PYTHONDONTWRITEBYTECODE 1

 RUN apt-get update

 RUN pip install --upgrade pip
 COPY .requirements.txt /app/
 RUN pip install -r requirements.txt


 COPY ./app

 ENTRYPOINT ['gunicorn', 'core.wsgi']