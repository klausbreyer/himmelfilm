#!/bin/bash
DATE=$(date +"%Y-%m-%d-%H-%M-%S")
fswebcam -r 1280x720 --no-banner /media/usb/www/www.schlachthof-wolken.de/images/$DATE.jpg
fswebcam -r 1920x1080 --no-banner /media/usb/www/www.schlachthof-wolken.de/hd/$DATE.jpg
