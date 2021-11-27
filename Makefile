# do this steps in this order.



# on local host to transfer the here edited config.
image-backup:
	rsync -av  pi@10.0.0.3:/media/usb/www/www.schlachthof-wolken.de/images/ images

# on local host deploy everything, but do not mess with the pictures.
deploy:
	cd ngrok && rsync -av --exclude='.git/' --exclude='.DS_Store' . pi@10.0.0.3:schlachthof-wolken-ngrok/
	cd fswebcam && rsync -av --exclude='.git/' --exclude='.DS_Store' . pi@10.0.0.3:schlachthof-wolken-fswebcam/
	cd apache && rsync -av --exclude='.git/' --exclude='.DS_Store' . pi@10.0.0.3:schlachthof-wolken-apache/
	cd rsync && rsync -av --exclude='.git/' --exclude='.DS_Store' . pi@10.0.0.3:schlachthof-wolken-rsync/

# on remote host to make a picture
image-shot:
	ssh pi@10.0.0.3  '~/schlachthof-wolken-fswebcam/fswebcam.sh'

start:
	ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'
	php -S 0.0.0.0:8000 -t docs/
