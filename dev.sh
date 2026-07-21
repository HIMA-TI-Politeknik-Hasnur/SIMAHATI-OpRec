#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="/tmp/simahati-dev.pids"

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; }
header(){ echo -e "\n${BOLD}${MAGENTA}═══════════════════════════════════════════════${NC}"; echo -e "${BOLD} $1 ${NC}"; echo -e "${BOLD}${MAGENTA}═══════════════════════════════════════════════${NC}"; }
sub()   { echo -e "${BOLD}── $1 ──${NC}"; }

ask_yes_no() {
  local prompt="$1"
  local default="${2:-y}"
  local yn
  while true; do
    if [ "$default" = "y" ]; then
      read -r -p "$prompt [Y/n] " yn
      yn="${yn:-y}"
    else
      read -r -p "$prompt [y/N] " yn
      yn="${yn:-n}"
    fi
    case "$yn" in
      [Yy]*) return 0 ;;
      [Nn]*) return 1 ;;
      *)     echo "  Jawab y atau n." ;;
    esac
  done
}

ask_input() {
  local prompt="$1"
  local default="$2"
  local val
  if [ -n "$default" ]; then
    read -r -p "$prompt [$default] " val
    echo "${val:-$default}"
  else
    read -r -p "$prompt " val
    echo "$val"
  fi
}

spinner() {
  local pid=$1
  local msg=$2
  local spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
  local i=0
  while kill -0 "$pid" 2>/dev/null; do
    i=$(( (i+1) % ${#spin} ))
    printf "\r  ${CYAN}%s${NC} %s" "${spin:$i:1}" "$msg"
    sleep 0.1
  done
  printf "\r  ${GREEN}✓${NC} %s\n" "$msg"
}

# ─── Prerequisites ──────────────────────────────────────────────

check_prereqs() {
  sub "Memeriksa prerequisites"
  echo ""

  local ok=true

  if ! command -v php &>/dev/null; then
    fail "PHP tidak ditemukan. Install PHP ^8.3."
    ok=false
  else
    local phpver
    phpver=$(php -v 2>&1 | head -1 | sed 's/^PHP \([0-9]\+\.[0-9]\+\).*/\1/')
    if awk "BEGIN{exit ($phpver < 8.3)}"; then
      ok "PHP $phpver ✓"
    else
      fail "PHP $phpver — minimal 8.3"
      ok=false
    fi
  fi

  if ! command -v composer &>/dev/null; then
    fail "Composer tidak ditemukan. Install composer terlebih dahulu."
    ok=false
  else
    ok "Composer $(composer --version 2>&1 | head -1)"
  fi

  if ! command -v node &>/dev/null; then
    fail "Node.js tidak ditemukan."
    ok=false
  else
    local nodever
    nodever=$(node -v 2>&1 | sed 's/^v//; s/\..*//')
    if [ "$nodever" -ge 18 ] 2>/dev/null; then
      ok "Node.js $(node -v)"
    else
      fail "Node.js $(node -v) — minimal 18"
      ok=false
    fi
  fi

  if ! command -v npm &>/dev/null; then
    fail "npm tidak ditemukan."
    ok=false
  else
    ok "npm $(npm -v)"
  fi

  if php -m 2>/dev/null | grep -qi pdo_mysql || \
     php -m 2>/dev/null | grep -qi pdo_sqlite || \
     php -m 2>/dev/null | grep -qi pdo_pgsql; then
    ok "PHP PDO driver tersedia"
  else
    fail "Tidak ada PDO driver (butuh mysql/sqlite/pgsql)"
    ok=false
  fi

  if ! command -v lsof &>/dev/null; then
    warn "lsof tidak ditemukan — deteksi port mungkin terbatas."
  fi

  echo ""
  if $ok; then
    ok "Semua prerequisites terpenuhi."
    return 0
  else
    fail "Ada prerequisites yang kurang. Silakan install."
    return 1
  fi
}

# ─── Port helpers ───────────────────────────────────────────────

port_pids() {
  lsof -ti "tcp:$1" 2>/dev/null || true
}

port_pid() {
  port_pids "$1" | head -1
}

kill_port() {
  local pids
  pids=$(port_pids "$1")
  if [ -n "$pids" ]; then
    local first_pid
    first_pid=$(echo "$pids" | head -1)
    warn "Port $1 sudah dipakai oleh PID $first_pid (dan ${pids//$'\n'/, })"
    if ask_yes_no "  Matikan proses tersebut?" "y"; then
      for pid in $pids; do
        kill "$pid" 2>/dev/null || true
      done
      sleep 0.5
      for pid in $pids; do
        if lsof -ti "tcp:$1" 2>/dev/null | grep -q "$pid"; then
          kill -9 "$pid" 2>/dev/null || true
        fi
      done
      ok "Port $1 dibebaskan"
    else
      fail "Port $1 masih dipakai. Gagal melanjutkan."
      return 1
    fi
  fi
}

# ─── Interactive .env setup ─────────────────────────────────────

setup_env_interactive() {
  sub "Konfigurasi .env"

  cd "$DIR/backend"

  if [ ! -f .env.example ]; then
    fail "File .env.example tidak ditemukan di backend/"
    return 1
  fi

  if [ -f .env ]; then
    if ask_yes_no ".env sudah ada. Buat ulang?" "n"; then
      cp .env.example .env
      info ".env dibuat ulang dari .env.example"
    else
      info "Menggunakan .env yang sudah ada"
      return 0
    fi
  else
    cp .env.example .env
    info ".env dibuat dari .env.example"
  fi

  echo ""
  info "Konfigurasi database (kosongkan untuk memakai default):"

  local db_conn
  db_conn=$(ask_input "  DB connection" "mysql")
  sed -i "s/^DB_CONNECTION=.*/DB_CONNECTION=$db_conn/" .env

  local db_host
  db_host=$(ask_input "  DB host" "127.0.0.1")
  sed -i "s/^DB_HOST=.*/DB_HOST=$db_host/" .env

  local db_port
  db_port=$(ask_input "  DB port" "3306")
  sed -i "s/^DB_PORT=.*/DB_PORT=$db_port/" .env

  local db_name
  db_name=$(ask_input "  Nama database" "simahati_oprec")
  sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$db_name/" .env

  local db_user
  db_user=$(ask_input "  DB username" "root")
  sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$db_user/" .env

  local db_pass
  read -r -s -p "  DB password []: " db_pass
  echo ""
  sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=${db_pass:-}/" .env

  php artisan key:generate --force

  ok ".env siap digunakan"
  echo ""

  if ! db_ping; then
    echo ""
    db_offer_sqlite
  fi
}

# ─── Setup ──────────────────────────────────────────────────────

setup() {
  header "SETUP SIMAHATI OpRec"
  echo ""

  check_prereqs || return 1

  if ! ask_yes_no "Lanjutkan setup?" "y"; then
    info "Setup dibatalkan."
    return
  fi
  echo ""

  setup_env_interactive

  sub "Menginstall dependencies backend"
  cd "$DIR/backend"
  composer install --no-interaction --prefer-dist &
  spinner $! "composer install..."

  sub "Membuat storage:link"
  php artisan storage:link --force 2>/dev/null || true
  ok "storage:link siap"

  sub "Database — verifikasi koneksi"
  if ! db_check; then
    echo ""
    warn "Migrasi dibatalkan karena database tidak bisa diakses."
    if ask_yes_no "  Lanjutkan setup tanpa database? (bisa pakai ./dev.sh nanti)" "n"; then
      info "Setup dilanjutkan tanpa database."
    else
      return 1
    fi
  else
    echo ""
    if ask_yes_no "Reset database (semua data akan hilang)?" "y"; then
      php artisan migrate:fresh --seed --force
      ok "Database siap"
    else
      info "Menjalankan migrate (tanpa fresh)..."
      php artisan migrate --force
      info "Seeder dilewati."
    fi
  fi

  sub "Menginstall dependencies frontend"
  cd "$DIR/frontend"
  npm install &
  spinner $! "npm install..."

  echo ""
  ok "Setup selesai!"
  echo ""
  echo -e "  ${BOLD}Jalankan:${NC}  ./dev.sh start"
  echo -e "  ${BOLD}Atau:${NC}      ./dev.sh menu"
  echo ""
}

# ─── Start ──────────────────────────────────────────────────────

start() {
  header "MENJALANKAN SERVER"
  echo ""

  git_sync_branch
  echo ""

  if ! command -v lsof &>/dev/null; then
    warn "lsof tidak tersedia, deteksi port conflict dilewati."
  else
    sub "Memeriksa port"
    kill_port 8000 || return 1
    kill_port 5173 || return 1
  fi
  echo ""

  > "$PID_FILE"

  sub "Memulai backend (Laravel) — http://127.0.0.1:8000"
  cd "$DIR/backend"

  if [ ! -f artisan ]; then
    fail "File artisan tidak ditemukan. Jalankan ./dev.sh setup dulu."
    return 1
  fi
  if [ ! -f .env ]; then
    fail "File .env tidak ditemukan. Jalankan ./dev.sh setup dulu."
    return 1
  fi

  php artisan storage:link --force 2>/dev/null || true

  sub "Memeriksa koneksi database"
  if ! db_ping; then
    warn "Database tidak bisa diakses!"
    if ask_yes_no "  Tetap jalankan backend?" "n"; then
      info "Backend akan tetap dijalankan."
    else
      db_offer_sqlite
      if db_ping; then
        ok "Database siap, melanjutkan..."
      else
        fail "Gagal. Setup database dulu: ./dev.sh setup"
        return 1
      fi
    fi
  else
    ok "Database terhubung"
  fi
  echo ""

  php artisan serve --host=127.0.0.1 --port=8000 \
    > /tmp/simahati-laravel.log 2>&1 &
  local be_pid=$!
  echo "$be_pid" > "$PID_FILE"
  info "PID: $be_pid  Log: /tmp/simahati-laravel.log"

  sub "Memulai frontend (Vite) — http://localhost:5173"
  cd "$DIR/frontend"

  if [ ! -d node_modules ]; then
    warn "node_modules tidak ditemukan."
    if ask_yes_no "  Jalankan npm install dulu?" "y"; then
      npm install &
      spinner $! "npm install..."
    fi
  fi

  npx vite --host \
    > /tmp/simahati-vite.log 2>&1 &
  local fe_pid=$!
  echo "$fe_pid" >> "$PID_FILE"
  info "PID: $fe_pid  Log: /tmp/simahati-vite.log"

  sub "Menunggu server siap"
  for i in $(seq 1 20); do
    if curl -s http://127.0.0.1:8000 >/dev/null 2>&1; then
      ok "Backend siap di ${GREEN}http://127.0.0.1:8000${NC}"
      break
    fi
    if [ "$i" -eq 20 ]; then
      warn "Backend belum siap — cek: tail -f /tmp/simahati-laravel.log"
    fi
    sleep 1
  done

  for i in $(seq 1 20); do
    if curl -s http://localhost:5173 >/dev/null 2>&1; then
      ok "Frontend siap di ${GREEN}http://localhost:5173${NC}"
      break
    fi
    if [ "$i" -eq 20 ]; then
      warn "Frontend belum siap — cek: tail -f /tmp/simahati-vite.log"
    fi
    sleep 1
  done

  echo ""
  echo -e "  ${BOLD}Backend${NC}   ${GREEN}http://127.0.0.1:8000${NC}"
  echo -e "  ${BOLD}Frontend${NC}  ${GREEN}http://localhost:5173${NC}"
  echo ""
  echo -e "  ${BOLD}Logs:${NC}"
  echo -e "    ${CYAN}tail -f /tmp/simahati-laravel.log${NC}"
  echo -e "    ${CYAN}tail -f /tmp/simahati-vite.log${NC}"
  echo ""

  if ask_yes_no "Buka frontend di browser?" "y"; then
    if command -v xdg-open &>/dev/null; then
      xdg-open "http://localhost:5173" 2>/dev/null || true
    elif command -v open &>/dev/null; then
      open "http://localhost:5173" 2>/dev/null || true
    else
      warn "Tidak bisa membuka browser secara otomatis."
    fi
  fi

  echo ""
  echo -e "  Ketik ${YELLOW}./dev.sh menu${NC} untuk menu interaktif."
}

# ─── Stop ───────────────────────────────────────────────────────

stop() {
  header "MENGHENTIKAN SERVER"
  echo ""

  if ! ask_yes_no "Hentikan server yang berjalan?" "y"; then
    info "Dibatalkan."
    return
  fi

  local killed=0

  if [ -f "$PID_FILE" ]; then
    while IFS= read -r pid; do
      if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
        sleep 0.3
        if kill -0 "$pid" 2>/dev/null; then
          kill -9 "$pid" 2>/dev/null || true
        fi
        ok "PID $pid dihentikan"
        killed=1
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi

  if command -v lsof &>/dev/null; then
    local remaining
    remaining="$(port_pids 8000)
$(port_pids 5173)"
    remaining="${remaining//$'\n'/ }"
    remaining="${remaining## }"
    if [ -n "$remaining" ]; then
      for pid in $remaining; do
        kill -9 "$pid" 2>/dev/null || true
      done
      ok "Proses sisa di port 8000/5173 dibersihkan"
      killed=1
    fi
  fi

  if [ "$killed" -eq 0 ]; then
    info "Tidak ada server yang berjalan."
  else
    ok "Semua server dihentikan."
  fi
}

# ─── Status ──────────────────────────────────────────────────────

status() {
  header "STATUS SERVER"
  echo ""

  local be_pid
  local fe_pid
  be_pid=$(port_pid 8000)
  fe_pid=$(port_pid 5173)

  if [ -n "$be_pid" ]; then
    local be_cpu be_mem
    be_cpu=$(ps -p "$be_pid" -o %cpu --no-headers 2>/dev/null || echo "?")
    be_mem=$(ps -p "$be_pid" -o %mem --no-headers 2>/dev/null || echo "?")
    echo -e "  ${GREEN}●${NC} Backend   RUNNING   PID $be_pid  CPU ${be_cpu}%  MEM ${be_mem}%"
    echo -e "             ${CYAN}http://127.0.0.1:8000${NC}"
  else
    echo -e "  ${RED}○${NC} Backend   STOPPED"
  fi

  if [ -n "$fe_pid" ]; then
    local fe_cpu fe_mem
    fe_cpu=$(ps -p "$fe_pid" -o %cpu --no-headers 2>/dev/null || echo "?")
    fe_mem=$(ps -p "$fe_pid" -o %mem --no-headers 2>/dev/null || echo "?")
    echo -e "  ${GREEN}●${NC} Frontend  RUNNING   PID $fe_pid  CPU ${fe_cpu}%  MEM ${fe_mem}%"
    echo -e "             ${CYAN}http://localhost:5173${NC}"
  else
    echo -e "  ${RED}○${NC} Frontend  STOPPED"
  fi

  echo ""
}

# ─── Restart ────────────────────────────────────────────────────

restart() {
  header "RESTART SERVER"
  echo ""
  stop
  echo ""
  start
}

# ─── Logs ────────────────────────────────────────────────────────

logs() {
  local target="${1:-}"

  header "LOG SERVER"
  echo ""

  if [ -z "$target" ]; then
    echo "  Pilih log yang mau ditampilkan:"
    echo "    1) Backend   (simahati-laravel.log)"
    echo "    2) Frontend  (simahati-vite.log)"
    echo "    3) Keduanya"
    echo ""
    read -r -p "  Pilihan [3]: " choice
    case "${choice:-3}" in
      1|be|backend)  target="be" ;;
      2|fe|frontend) target="fe" ;;
      *)             target="all" ;;
    esac
  fi

  case "$target" in
    be|backend)
      if [ ! -f /tmp/simahati-laravel.log ]; then
        warn "File log backend belum ada."
        warn "Jalankan ./dev.sh start dulu untuk memulai server."
        return
      fi
      info "Menampilkan log backend (Ctrl+C untuk keluar)..."
      echo ""
      tail -f /tmp/simahati-laravel.log
      ;;
    fe|frontend|vite)
      if [ ! -f /tmp/simahati-vite.log ]; then
        warn "File log frontend belum ada."
        warn "Jalankan ./dev.sh start dulu untuk memulai server."
        return
      fi
      info "Menampilkan log frontend (Ctrl+C untuk keluar)..."
      echo ""
      tail -f /tmp/simahati-vite.log
      ;;
    *)
      local missing=0
      [ ! -f /tmp/simahati-laravel.log ] && missing=1
      [ ! -f /tmp/simahati-vite.log ] && missing=1
      if [ "$missing" -eq 1 ]; then
        warn "Salah satu atau kedua file log belum ada."
        warn "Jalankan ./dev.sh start dulu untuk memulai server."
        return
      fi
      info "Menampilkan kedua log (Ctrl+C untuk keluar)..."
      echo ""
      tail -f /tmp/simahati-laravel.log /tmp/simahati-vite.log
      ;;
  esac
}

# ─── Fresh (reset database) ─────────────────────────────────────

fresh() {
  header "RESET DATABASE"
  echo ""

  cd "$DIR/backend"
  if [ ! -f .env ]; then
    fail "File .env tidak ditemukan. Jalankan ./dev.sh setup dulu."
    return 1
  fi

  sub "Memeriksa koneksi database"
  if ! db_check; then
    echo ""
    return 1
  fi
  echo ""

  warn "Semua data di database akan hilang!"
  if ! ask_yes_no "Yakin reset database?" "n"; then
    info "Dibatalkan."
    return
  fi

  sub "Menjalankan migrate:fresh --seed"
  php artisan migrate:fresh --seed --force
  ok "Database di-reset dan di-seed ulang."
}

# ─── Check ──────────────────────────────────────────────────────

check() {
  header "PREREQUISITES CHECK"
  echo ""
  check_prereqs
}

# ─── Git sync branch ────────────────────────────────────────────

git_sync_branch() {
  local target="${1:-feature/deploy-localhost}"
  local branch
  branch=$(cd "$DIR" && git branch --show-current 2>/dev/null)

  sub "Memeriksa branch git"

  if [ "$branch" != "$target" ]; then
    warn "Sekarang di branch '$branch', bukan '$target'"
    if ask_yes_no "  Beralih ke $target?" "y"; then
      git checkout "$target" 2>/dev/null && ok "Berpindah ke $target" || {
        fail "Gagal checkout $target. Branch belum ada?"
        return 1
      }
    else
      info "Tetap di branch '$branch'"
      return 0
    fi
  else
    ok "Branch: $target"
  fi

  info "Menarik perubahan terbaru dari origin/$target..."
  cd "$DIR"
  git pull origin "$target" 2>/dev/null && ok "Branch diperbarui" || warn "Gagal pull (mungkin offline)"
}

# ─── Interactive Menu ───────────────────────────────────────────

menu() {
  local choice

  clear 2>/dev/null || true
  header "SIMAHATI OpRec — DEV TOOL"
  echo ""
  git_sync_branch
  echo ""

  while true; do
    clear 2>/dev/null || true
    header "SIMAHATI OpRec — DEV TOOL"
    echo ""

    local be_pid fe_pid
    be_pid=$(port_pid 8000)
    fe_pid=$(port_pid 5173)

    echo -e "  ${BOLD}Branch:${NC} $(cd "$DIR" && git branch --show-current 2>/dev/null)"

    if [ -n "$be_pid" ] || [ -n "$fe_pid" ]; then
      echo ""
      echo -e "  ${BOLD}Server Status:${NC}"
      [ -n "$be_pid" ] && echo -e "    ${GREEN}●${NC} Backend  RUNNING  (PID $be_pid)" \
                     || echo -e "    ${RED}○${NC} Backend  STOPPED"
      [ -n "$fe_pid" ] && echo -e "    ${GREEN}●${NC} Frontend RUNNING  (PID $fe_pid)" \
                     || echo -e "    ${RED}○${NC} Frontend STOPPED"
      echo ""
    else
      echo ""
    fi

    echo -e "  ${BOLD}Menu:${NC}"
    echo ""
    echo -e "    ${GREEN}1${NC})  Setup         Install dependencies & konfigurasi"
    echo -e "    ${GREEN}2${NC})  Start         Jalankan server"
    echo -e "    ${GREEN}3${NC})  Stop          Hentikan server"
    echo -e "    ${GREEN}4${NC})  Restart       Restart server"
    echo -e "    ${GREEN}5${NC})  Status        Lihat status server"
    echo -e "    ${GREEN}6${NC})  Logs          Lihat log server"
    echo -e "    ${GREEN}7${NC})  Fresh         Reset database"
    echo -e "    ${GREEN}8${NC})  Check         Periksa prerequisites"
    echo -e "    ${GREEN}9${NC})  DB: Check     Uji koneksi & buat database jika belum ada"
    echo ""
    echo -e "    ${GREEN}0${NC})  Keluar"
    echo ""
    read -r -p "  Pilihan [0-8]: " choice
    echo ""

    case "$choice" in
      1) setup
         echo ""
         read -r -p "  Tekan Enter..." ;;
      2) start
         echo ""
         echo -e "  ${CYAN}Server sedang berjalan di background.${NC}"
         read -r -p "  Tekan Enter untuk kembali ke menu..." ;;
      3) stop
         echo ""
         read -r -p "  Tekan Enter..." ;;
      4) restart
         echo ""
         read -r -p "  Tekan Enter..." ;;
      5) status
         echo ""
         read -r -p "  Tekan Enter..." ;;
      6) logs ""
         echo ""
         read -r -p "  Tekan Enter..." ;;
      7) fresh
         echo ""
         read -r -p "  Tekan Enter..." ;;
      8) check
         echo ""
         read -r -p "  Tekan Enter..." ;;
      9|db)
         db_check
         echo ""
         read -r -p "  Tekan Enter..." ;;
      0|q|exit)
         header "Sampai jumpa! 👋"
         exit 0 ;;
      *)
         warn "Pilihan tidak dikenal: $choice"
         sleep 1 ;;
    esac
  done
}

# ─── Database helpers ────────────────────────────────────────────

db_read_env() {
  DB_CONN=$(grep -oP '^DB_CONNECTION=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "mysql")
  DB_HOST=$(grep -oP '^DB_HOST=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "127.0.0.1")
  DB_PORT=$(grep -oP '^DB_PORT=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "3306")
  DB_NAME=$(grep -oP '^DB_DATABASE=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "simahati_oprec")
  DB_USER=$(grep -oP '^DB_USERNAME=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "root")
  DB_PASS=$(grep -oP '^DB_PASSWORD=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "")
  DB_SOCK=$(grep -oP '^DB_SOCKET=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "")
}

db_conn_base() {
  local args=""
  if [ "$DB_CONN" = "mysql" ]; then
    args="-u $DB_USER"
    if [ -n "$DB_PASS" ]; then args="$args -p$DB_PASS"; fi
    if [ -n "$DB_SOCK" ]; then args="$args -S $DB_SOCK"; fi
    if [ -z "$DB_SOCK" ]; then args="$args -h $DB_HOST -P $DB_PORT"; fi
    echo "$args"
  elif [ "$DB_CONN" = "sqlite" ]; then
    echo ""
  fi
}

db_mysql() {
  local sql="$1"
  local args
  args=$(db_conn_base)
  mysql $args -e "$sql" 2>&1
}

db_psql() {
  local sql="$1"
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "$sql" 2>&1
}

db_check() {
  sub "Memeriksa koneksi database"

  db_read_env

  if [ "$DB_CONN" = "sqlite" ]; then
    local db_path
    db_path=$(grep -oP '^DB_DATABASE=\K.*' "$DIR/backend/.env" 2>/dev/null || echo "database/database.sqlite")
    if [ -f "$DIR/backend/$db_path" ]; then
      ok "SQLite: $db_path"
      return 0
    else
      warn "SQLite: $db_path belum ada (akan dibuat saat migrasi pertama)"
      return 0
    fi
  fi

  if ! command -v "$DB_CONN" &>/dev/null; then
    fail "CLI \`$DB_CONN\` tidak ditemukan."
    return 1
  fi

  local result
  if [ "$DB_CONN" = "mysql" ]; then
    result=$(db_mysql "SELECT 1 AS test;" 2>&1)
  elif [ "$DB_CONN" = "pgsql" ]; then
    result=$(db_psql "SELECT 1 AS test;" 2>&1)
  else
    fail "DB_CONNECTION=$DB_CONN belum didukung oleh script ini."
    return 1
  fi

  if echo "$result" | grep -qi "error\|refused\|denied\|not found"; then
    fail "Gagal konek ke $DB_CONN:"
    echo ""
    echo -e "  ${RED}$result${NC}" | head -5
    echo ""
    echo "  Config dari .env:"
    echo -e "    ${BOLD}DB_CONNECTION${NC}  $DB_CONN"
    echo -e "    ${BOLD}DB_HOST${NC}        $DB_HOST"
    echo -e "    ${BOLD}DB_PORT${NC}        $DB_PORT"
    [ -n "$DB_SOCK" ] && echo -e "    ${BOLD}DB_SOCKET${NC}      $DB_SOCK"
    echo -e "    ${BOLD}DB_DATABASE${NC}    $DB_NAME"
    echo -e "    ${BOLD}DB_USERNAME${NC}    $DB_USER"
    echo ""
    return 1
  fi

  ok "Koneksi ke $DB_CONN@$DB_HOST:$DB_PORT berhasil"

  db_mysql "SHOW DATABASES LIKE '$DB_NAME';" 2>/dev/null | grep -q "$DB_NAME" && {
    ok "Database \`$DB_NAME\` sudah ada"
  } || {
    warn "Database \`$DB_NAME\` belum ada"
    if ask_yes_no "  Buat sekarang?" "y"; then
      if [ "$DB_CONN" = "mysql" ]; then
        db_mysql "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
      elif [ "$DB_CONN" = "pgsql" ]; then
        db_psql "CREATE DATABASE \"$DB_NAME\";"
      fi
      ok "Database \`$DB_NAME\` berhasil dibuat"
    fi
  }
}

db_ping() {
  db_read_env
  if [ "$DB_CONN" = "sqlite" ]; then return 0; fi
  if ! command -v "$DB_CONN" &>/dev/null; then return 1; fi
  if [ "$DB_CONN" = "mysql" ]; then
    db_mysql "SELECT 1;" >/dev/null 2>&1
  elif [ "$DB_CONN" = "pgsql" ]; then
    db_psql "SELECT 1;" >/dev/null 2>&1
  fi
}

db_offer_sqlite() {
  warn "Tidak bisa konek ke database $DB_CONN."
  if ask_yes_no "  Beralih ke SQLite untuk development?" "y"; then
    info "Mengubah .env ke SQLite..."
    sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' "$DIR/backend/.env"
    sed -i '/^DB_HOST/d;/^DB_PORT/d;/^DB_USERNAME/d;/^DB_PASSWORD/d;/^DB_SOCKET/d' "$DIR/backend/.env"
    echo "DB_DATABASE=database/database.sqlite" >> "$DIR/backend/.env"
    cd "$DIR/backend"
    touch database/database.sqlite
    ok "Beralih ke SQLite. Jalankan ./dev.sh setup lagi."
    return 0
  fi
  return 1
}

# ─── Help ────────────────────────────────────────────────────────

help() {
  echo -e "${BOLD}Pemakaian:${NC} $0 {command}"
  echo ""
  echo "  ${BOLD}Commands:${NC}"
  echo "    ${GREEN}menu${NC}       Tampilkan menu interaktif (default)"
  echo "    ${GREEN}setup${NC}      Install dependencies & siapkan database"
  echo "    ${GREEN}start${NC}      Jalankan backend (8000) + frontend (5173)"
  echo "    ${GREEN}stop${NC}       Hentikan server"
  echo "    ${GREEN}restart${NC}    stop + start"
  echo "    ${GREEN}status${NC}     Status server"
  echo "    ${GREEN}logs${NC}       [be|fe]  Tampilkan log"
  echo "    ${GREEN}fresh${NC}      Reset database (migrate:fresh --seed)"
  echo "    ${GREEN}check${NC}      Periksa prerequisites"
  echo ""
  echo -e "  ${YELLOW}Contoh:${NC}"
  echo "    $0           # Menu interaktif"
  echo "    $0 start     # Langsung start"
  echo "    $0 logs be   # Log backend"
  echo ""
}

# ─── Main ────────────────────────────────────────────────────────

case "${1:-menu}" in
  menu|interactive) menu ;;
  setup)   setup ;;
  start)   start ;;
  stop)    stop ;;
  restart) restart ;;
  status)  status ;;
  logs)    logs "$2" ;;
  fresh)   fresh ;;
  check)   check ;;
  db-check|db)   db_check ;;
  help|--help|-h) help ;;
  *)
    echo -e "${RED}Perintah tidak dikenal:${NC} $1"
    echo ""
    help
    exit 1
    ;;
esac
