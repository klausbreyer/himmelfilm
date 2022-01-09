#!/bin/bash
DATE=$(date +"%Y-%m-%d-%H-%M-%S")
# fswebcam -r 1280x720 --no-banner ~/www.schlachthof-wolken.de/images/$DATE.jpg
# fswebcam -r 1920x1080 --no-banner ~/www.schlachthof-wolken.de/hd/$DATE.jpg
fswebcam -r 320x240 --no-banner ~/www.schlachthof-wolken.de/0,08/$DATE.jpg
fswebcam -r 640x480 --no-banner ~/www.schlachthof-wolken.de/0,3/$DATE.jpg
fswebcam -r 1024x768 --no-banner ~/www.schlachthof-wolken.de/0,8/$DATE.jpg
fswebcam -r 1280x960 --no-banner ~/www.schlachthof-wolken.de/1,2/$DATE.jpg
# fswebcam -r 2560x1920 --no-banner ~/www.schlachthof-wolken.de/5mp/$DATE.jpg
