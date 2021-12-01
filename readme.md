How to webcams on raspi: https://www.raspberrypi.org/documentation/usage/webcams/

## ngrok as system service

How to run ngrok as systemd service: https://stackoverflow.com/a/50808709

root@northdakota:/etc/systemd/system# ln -s /home/pi/fswebcam/ngrok.service ngrok.service

systemctl start ngrok.service

## Apache

@todo: add apache config here to repo.
Cors Headers.

```
sudo a2enmod headers
```

Header add Access-Control-Allow-Origin "\*"
Header add Access-Control-Allow-Headers "origin, x-requested-with, content-type"
Header add Access-Control-Allow-Methods "GET, OPTIONS"

## pi zero wifi config: https://core-electronics.com.au/tutorials/raspberry-pi-zerow-headless-wifi-setup.html
