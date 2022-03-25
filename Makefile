start:
	ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'
	php -S 0.0.0.0:8000 -t ui/

deploy:
	cd allinone && rsync -av --exclude='.git/' --exclude='.DS_Store' . pi@10.0.0.5:allinone/ --delete
	scp ui/index.html pi@10.0.0.5:www.himmelfilm.de
	scp ui/styles.css pi@10.0.0.5:www.himmelfilm.de
	scp ui/index.js pi@10.0.0.5:www.himmelfilm.de
