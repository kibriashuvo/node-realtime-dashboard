FROM node:12

WORKDIR /src

RUN npm install -g express-generator

RUN express -e

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD npm start

