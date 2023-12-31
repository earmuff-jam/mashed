
include .env

# load api
startserver:
	cd apilayer && \
	GO111MODULE=on \
	go run main.go

# api unit tests
testapicode:
	cd apilayer/handler && go test

# load data
datamini:
	cd server && \
	./_addTestData.sh ${COMMUNITY_TEST_USER} ${DATABASE_DOCKER_CONTAINER_PORT} ${POSTGRES_DB} ${DATABASE_DOCKER_CONTAINER_IP_ADDRESS}

# load ui
startclient:
	cd frontend && \
	yarn dev