#!/bin/bash
DATE=$(date +"%Y-%m-%d-%H-%M-%S")
fswebcam -r 1280x720 --no-banner /media/usb/www/www.schlachthof-wolken.de/images/$DATE.jpg
