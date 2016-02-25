FROM node:4.1.2
MAINTAINER kumali "li.jun.kuma@gmail.com"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
ENTRYPOINT npm test
