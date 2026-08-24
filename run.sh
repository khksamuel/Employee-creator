#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ $# -gt 1 || ( $# -eq 1 && "$1" != "demo" ) ]]; then
  echo "Usage: ./run.sh [demo]" >&2
  exit 1
fi

api_run_args=()
if [[ "${1:-}" == "demo" ]]; then
  api_run_args=(-Dspring-boot.run.profiles=demo)
  echo "Demo mode: seeding the database on API startup."
fi

cleanup() {
  kill "${api_pid:-}" "${web_pid:-}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting Employee Creator API..."
(
  cd "$project_root/employee-creator-api"
  mvn spring-boot:run "${api_run_args[@]}"
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
