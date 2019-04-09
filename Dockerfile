FROM node:10.13.0
WORKDIR /usr/src/app
COPY . /usr/src/app
CMD npm install
EXPOSE 4000
CMD  ["node", "server.js"]