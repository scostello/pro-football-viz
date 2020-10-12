#!/usr/bin/env sh

set -e

script="${1:-watch}"

exec npm run "${script}"
