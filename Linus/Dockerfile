FROM node:14.12-alpine3.10
WORKDIR /app
COPY datenbank-physik .

RUN apk add nodejs npm

RUN apk add python2 python3
RUN ln -sf /usr/bin/python2 /usr/bin/python && npm config set python /usr/bin/python

RUN apk add make g++ gcc linux-headers libstdc++

RUN npm install

RUN npm run build

RUN apk add composer php php-ctype php-pdo php-pdo_mysql php-tokenizer php-xml php-simplexml php-xmlwriter php-dom php-session php-curl
RUN composer install

CMD php bin/console doctrine:migrations:migrate --no-interaction && php -S 0.0.0.0:8080 -t public