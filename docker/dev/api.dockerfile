FROM node:16-alpine

WORKDIR /app

COPY ../../package.json ./

CMD yarn; yarn start;