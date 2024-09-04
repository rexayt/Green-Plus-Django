 FROM python:3.12.3-slim-bullseye
 WORKDIR /GreenPlus
 
 ENV PYTHONUNBUFFERED 1
 ENV PYTHONDONTWRITEBYTECODE 1

 RUN apt-get update

 RUN pip install --upgrade pip
 COPY .requirements.txt /GreenPlus/
 RUN pip install -r requirements.txt


 COPY ./GreenPlus

 ENTRYPOINT ['gunicorn', 'core.wsgi']