#!/usr/bin/env bash
set -e

echo "==> Starting backend (Laravel) on port 8000 ..."
cd backend
php artisan serve --host=127.0.0.1 --port=8000 &
BACKEND_PID=$!

echo "==> Starting frontend (Vite) on port 5173 ..."
cd ../frontend
npx vite --host 2>/dev/null &
FRONTEND_PID=$!

echo ""
echo "  Backend:  http://127.0.0.1:8000"
echo "  Frontend: http://127.0.0.1:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
