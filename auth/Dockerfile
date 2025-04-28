FROM node:20 AS build

WORKDIR app/
COPY yarn.lock package*.json .

RUN ["yarn", "install"]

COPY . .

EXPOSE 8080

CMD ["yarn", "startDev", "--host", "0.0.0.0"]
