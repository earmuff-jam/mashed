
#!/bin/bash

# File: _main.sh
# Description: Loads the database layer for the application

help() {
    echo "Usage: $0 [option...] {loadEnv, loadDb, loadTestEnv, loadMigration}" >&2
    echo
    echo "   -e, --loadEnv              Loads the environment variables only"
    echo "   -f, --loadDb               Allows to build the db from scratch erasing all data"
    echo "   -t, --loadTestEnv          Allows to load all containers and start with new fresh data. This is like a test environment similar to deployment env."
    echo "   -m, --loadMigration        Allows to load the migration in sequence. Does not erase data but requires container to be up"
    echo
    exit 1
}

loadEnv() {
    echo "envOnly flag provided. only loading env variables."
    chmod +x setup/_loadEnvVariables.sh
    ./setup/_loadEnvVariables.sh
}

loadDb() {

    echo "loadDb flag provided. building psql docker image and running migrations."

    docker-compose down 
    docker-compose -f docker-compose-db.yml up --build -d

}

loadTestEnv() {

    echo "load test environment flag provided. building all containers. please wait"

    docker-compose down --remove-orphans --volumes
    docker-compose -f docker-compose.yml up --build -d
}

loadMigration() {

    echo "migration flag provided. running migration in sequence."

    chmod +x setup/_loadMigration.sh
    ./setup/_loadMigration.sh
}

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h|--help) help; shift ;;
        -e|--loadEnv) loadEnv; shift ;;
        -f|--loadDb) loadDb; shift ;;
        -t|--loadTestEnv) loadTestEnv; shift ;;
        -m|--loadMigration) loadMigration; shift ;;
        *) help; echo "Unknown parameter passed: $1" ;;
    esac
    shift
done
