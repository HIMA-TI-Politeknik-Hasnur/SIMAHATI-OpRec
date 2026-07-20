FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    nginx supervisor postgresql-dev libpng-dev libzip-dev oniguruma-dev curl \
    && docker-php-ext-install pdo pdo_pgsql gd zip mbstring

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini $PHP_INI_DIR/conf.d/99-app.ini

WORKDIR /var/www

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY . .
RUN php artisan key:generate --force

RUN php artisan storage:link --force

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
