#!/usr/bin/env bash
set -e

if [[ "$1" = 'server' ]]; then
  node_modules/http-server/bin/http-server -p $PORT /app
fi

if [[ "$1" = 'lint' ]]; then
  npm run check-formatting
  exit
fi

if [[ "$1" = 'prettify' ]]; then
  npm run fix-formatting
  exit
fi

exec "$@"
