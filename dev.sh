#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="/tmp/simahati-dev.pids"

start() {
  echo "==> Starting backend (Laravel) on port 8000 ..."
  cd "$DIR/backend"
  nohup php artisan serve --host=127.0.0.1 --port=8000 > /tmp/laravel.log 2>&1 &
  echo $! > "$PID_FILE"

  echo "==> Starting frontend (Vite) on port 5173 ..."
  cd "$DIR/frontend"
  nohup npx vite --host > /tmp/vite.log 2>&1 &
  echo $! >> "$PID_FILE"

  echo ""
  echo "  Backend:  http://127.0.0.1:8000"
  echo "  Frontend: http://127.0.0.1:5173"
  echo "  Logs:     tail -f /tmp/laravel.log /tmp/vite.log"
  echo ""
  echo "  Run ./dev.sh stop to stop all servers."
}

stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "No PID file found. Killing by process name..."
    pkill -f "artisan serve" 2>/dev/null || true
    pkill -f "bin/vite" 2>/dev/null || true
    echo "Done."
    return
  fi
  echo "==> Stopping servers ..."
  while IFS= read -r pid; do
    kill "$pid" 2>/dev/null && echo "  Stopped PID $pid" || true
  done < "$PID_FILE"
  rm -f "$PID_FILE"
  echo "Done."
}

case "${1:-start}" in
  start) start ;;
  stop)  stop ;;
  *)     echo "Usage: $0 {start|stop}" ;;
esac
