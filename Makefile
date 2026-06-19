# make build:
# 	docker compose -f

make:
	all

make install:
	cd frontend && npm install && cd ../backend && npm install

make fclean:
	rm -rf frontend/package-lock.json
	rm -rf backend/package-lock.json