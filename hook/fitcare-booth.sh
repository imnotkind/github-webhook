#!/bin/bash


# DIRECTORY TO THE REPOSITORY
REPOSITORY="/home/imnotkind/public_html/fitcare-booth"

cd $REPOSITORY

git pull

cd server

npm install

forever restart index.js
