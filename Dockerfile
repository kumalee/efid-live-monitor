FROM node:4.1.2
MAINTAINER kumali "li.jun.kuma@gmail.com"

VOLUME ./code:/code
COPY ./code/package.json /code/package.json
WORKDIR /code
RUN npm install
ENTRYPOINT npm test
