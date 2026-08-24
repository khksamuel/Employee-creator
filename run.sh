#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  kill "${api_pid:-}" "${web_pid:-}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting Employee Creator API..."
(
  cd "$project_root/employee-creator-api"
  mvn spring-boot:run
) &
api_pid=$!

echo "Starting Employee Creator web app..."
(
  cd "$project_root/employee-creator-web"
  npm run dev -- --host 0.0.0.0
) &
web_pid=$!

echo "API: http://localhost:8080"
echo "Web app: usually http://localhost:5173"
echo "Press Ctrl+C to stop both services."

wait "$api_pid" "$web_pid"
