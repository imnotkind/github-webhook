#!/bin/bash


# DIRECTORY TO THE REPOSITORY
REPOSITORY="/home/imnotkind/Work/fitcare-booth2"

cd $REPOSITORY

git pull

cd back

python manage.py makemigrations
python manage.py migrate
