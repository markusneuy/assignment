#!/bin/sh
set -e

if [ "$1" = "server" ]; then
  shift;

  exec node /usr/src/app/dist/server.js "$@"
elif [ "$1" = "create-migration" ]; then
  shift;

  exec npm run createMigration
elif [ "$1" = "run-migrations" ]; then
  shift;

  exec npm run runMigrations
fi

exec "$@"
