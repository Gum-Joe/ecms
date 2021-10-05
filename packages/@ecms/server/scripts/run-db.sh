# Starts a docker postgres DB for development
docker run -d	--name dev-postgres	-e POSTGRES_PASSWORD=Pass2021! -p 5436:5432 postgres