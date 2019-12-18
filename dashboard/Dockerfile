FROM node:12

WORKDIR /src

RUN npm install -g express-generator

RUN express -e

COPY package*.json ./

COPY routes/index.js ./routes/index.js

RUN npm install

EXPOSE 3000

CMD npm start

