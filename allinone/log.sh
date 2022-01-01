#!/bin/bash
# DATE=$(date +"%Y-%m-%d-%H-%M-%S")
uptime >> log.log
curl -s "https://api.ipify.org" >> log.log

