FROM node:12

WORKDIR /src

RUN npm install -g express-generator

RUN express -e

COPY package*.json ./

COPY app.js ./

COPY routes/* ./routes/

COPY views/* ./views/

RUN npm install

EXPOSE 3000

CMD npm start

