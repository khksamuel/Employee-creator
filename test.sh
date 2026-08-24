#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Running backend tests..."
(
  cd "$project_root/employee-creator-api"
  mvn test
)

echo
echo "Running frontend tests..."
(
  cd "$project_root/employee-creator-web"
  npm test
)

echo
echo "All tests passed."
