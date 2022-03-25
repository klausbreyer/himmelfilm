#!/bin/bash
DATE=$(date +"%Y-%m-%d-%H-%M-%S")
fswebcam -r 320x240 --no-banner ~/www.himmelfilm.de/0,08/$DATE.jpg
fswebcam -r 640x480 --no-banner ~/www.himmelfilm.de/0,3/$DATE.jpg
fswebcam -r 1024x768 --no-banner ~/www.himmelfilm.de/0,8/$DATE.jpg
