#!/bin/bash
rsync -avz --exclude='.git/' /media/usb/www/www.schlachthof-wolken.de/ ssh-255519-kb1@klaus-breyer.de:~/files.v01.io/schlachthof-wolken/ --delete
