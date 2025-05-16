FROM node:20.13.0-alpine AS build

ENV NODE_ENV production

WORKDIR /app

COPY ./package*.json ./

RUN ["yarn", "install"]

EXPOSE 8080

COPY --chown=node:node . /app

USER node

CMD ["yarn", "start", "--host", "0.0.0.0"]
