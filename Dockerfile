FROM ubuntu:xenial

RUN apt-get update && apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY . /usr/app/

WORKDIR /usr/app
RUN npm install

CMD node /usr/app/src/server.js