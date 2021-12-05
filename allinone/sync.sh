#!/bin/bash
rsync -avz --exclude='.git/' --exclude='5mp' ~/www.schlachthof-wolken.de/ ssh-255519-kb1@klaus-breyer.de:~/files.v01.io/schlachthof-wolken-nebraska/ --delete

