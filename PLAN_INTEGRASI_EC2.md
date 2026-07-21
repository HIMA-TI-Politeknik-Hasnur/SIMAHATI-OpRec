# Plan Integrasi Vercel (Frontend) → EC2 (Backend)

## Arsitektur

```
User → Vercel (HTTPS) → fetch → EC2 (HTTPS via nip.io) → Laravel → MySQL
                                                           ↓
                                                    CORS: Origin = vercel.app
                                                    OPTIONS handled by Nginx
```

## Instance EC2

| Instance | RAM | Harga/bln (all-in) | Rekomendasi |
|----------|-----|---------------------|-------------|
| t4g.micro (ARM) | 1 GB | ~$6.77 | Paling murah, perlu swap |
| t3.small (x86) | 2 GB | ~$16.94 | Recommended, nyaman |

## Domain & SSL

Gunakan **nip.io** — gratis, DNS otomatis mengarah ke IP EC2:
```
http://<EC2-PUBLIC-IP>.nip.io
```

Pasang **Certbot** untuk HTTPS:
```bash
snap install certbot --classic
certbot --nginx -d <EC2-IP>.nip.io
```

## Security Group EC2

| Port | Source | Fungsi |
|------|--------|--------|
| 22 | IP developer | SSH |
| 80 | 0.0.0.0/0 | HTTP (certbot challenge) |
| 443 | 0.0.0.0/0 | HTTPS (API) |
| 3306 | - | Jangan dibuka (MySQL localhost-only) |

## Nginx Config

CORS header + OPTIONS preflight handle di Nginx (biar ga ke PHP):

```nginx
server {
    listen 443 ssl;
    server_name <EC2-IP>.nip.io;

    ssl_certificate /etc/letsencrypt/live/<EC2-IP>.nip.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<EC2-IP>.nip.io/privkey.pem;

    root /var/www/<project>/public;

    # CORS headers
    add_header Access-Control-Allow-Origin "https://simahati-op-rec.vercel.app" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Handle OPTIONS preflight langsung (balik 204, ga ke PHP)
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "https://simahati-op-rec.vercel.app";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN";
        add_header Access-Control-Allow-Credentials "true";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## File yang perlu diubah

| File | Baris | Nilai |
|------|-------|-------|
| `frontend/src/api.ts:3` | `API_BASE_URL` | `https://<EC2-IP>.nip.io` |
| `backend/.env:5` | `APP_URL` | `https://<EC2-IP>.nip.io` |
| `backend/.env:38` | `FRONTEND_URL` | `https://simahati-op-rec.vercel.app` |

## Database

- Ekspor MySQL dari InfinityFree
- Buat database di EC2 (MySQL atau RDS)
- Import SQL dump
- Update `DB_*` di `.env`

## Langkah Deploy

1. Setup EC2 (install Nginx + PHP 8.3 + MySQL + Composer)
2. Clone project ke EC2, `composer install --optimize-autoloader --no-dev`
3. Set `.env` dengan nilai baru
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan config:cache`
7. Pasang SSL (certbot)
8. Update `frontend/src/api.ts` → `API_BASE_URL`
9. Deploy frontend ke Vercel
