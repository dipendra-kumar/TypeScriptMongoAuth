FROM node:16-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache git

CMD yarn; yarn prod;