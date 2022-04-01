# himmelfilm

## About

Open Source project that enables an raspbery pi to capture an image of the sky above berlin, host the pictures on the raspbery pi, and provide the super basic interface, that you can see under: <https://www.himmelfilm.de>

### Example

![Example](https://www.himmelfilm.de/0,8/2022-03-25-18-05-01.jpg "Example")

### Origin of the project

I life in a flat in the middle of berlin with a nice rooftop terace. I love the stunning view and wanted to "convervate" the most precious views. First and foremost, this is a private project that I wanted to make accessible for others. But mainly it is for myself, that I do not forget anything of the project.

### Origin of the name

My 5 year old son came up with this super descriptive name for this project I fiddle around for over a year.

## Setup

### Hardware Shopping

1. Get a USB Webcam (one without a microfone, if you want to use it like me.)
1. Get a Raspbery Pi 2W

### Connection

1. Setup a Cloudflare Account
1. Setup a Domain, configure DNS to point to Cloudflare

### Basic Raspbery Pi configuration

1. `sudo apt-get update && sudo apt-get dist-upgrade -y`
1. Configure the raspbery pi and raise the current limit from 600 mA to 1,200 mA power output on the USB port.a corresponding boot parameter must be set. (Source: <https://www.elektronik-kompendium.de/sites/raspberry-pi/2206111.htm> )
    1. `sudo vim /boot/config.txt` and add: `max_usb_current=1`

### Cloudflare Tunnel

1. Configure apache like *himmelfilm-apache.conf* of the repo.
    1. Use port 8080
    1. No SSL configuration.
    1. standard port
    1. `ln -s  /home/pi/www.himmelfilm.de html`
1. Configure cloudflared
    1. Get a cloudflared arm build compatible with raspbery pi (not in the download section of the homepage)
    1. `cloudflared tunnel login`
    1. `cloudflared tunnel create nebraska` with tunnel endpoint of :8080
    1. `cloudflared tunnel list`
    1. Run cloudflared as a service: <https://orth.uk/ssh-over-cloudflare/#configure-the-cloudflared-service>
    1. Map your tunnel via CNAME settings to www. of the domain you did set up with cloudflare
    1. configure cloudflare to redirect http -> https and non-www to www

### Raspi Scripting

1. Change IP of raspi in *Makefile*
1. `make deploy` to transfer the files
1. `crontab -e`: `* * * * * /bin/bash ~/allinone/capture.sh`
    1. now images are saved to the path that is configured via the apache

## Additional Ressources

1. Pre-configure a raspi with a wifi credentials: *wpa_supplicant.conf*
1. (dont forget the `ssh` enabling file, as well.)
