#!/usr/bin/env bash
# Exit on error
set -o errexit

apt-get install unixodbc-dev
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

python manage.py migrate