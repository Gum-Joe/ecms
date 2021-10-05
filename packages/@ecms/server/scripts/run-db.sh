# Starts a docker postgres DB for development
# IMPORTANT: UNDER NO CIRCUMSTANCES SHOULD THE PASSWORD BELOW BE USED IN PROD
docker run -d	--name dev-postgres	-e POSTGRES_PASSWORD=Pass2021! -p 5436:5432 postgres