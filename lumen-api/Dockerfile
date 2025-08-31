FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev \
 && docker-php-ext-install pdo pdo_mysql \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*

RUN sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
 && printf "<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n" \
    >> /etc/apache2/apache2.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . /var/www/html

RUN composer install --no-dev --prefer-dist --optimize-autoloader \
 && php -r "file_exists('.env') || copy('.env.example','.env');"

RUN php -r "is_dir('bootstrap/cache') || mkdir('bootstrap/cache', 0777, true);" \
 && php -r "is_dir('storage') || mkdir('storage', 0777, true);" \
 && chown -R www-data:www-data /var/www/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -fsS http://localhost/health || exit 1
