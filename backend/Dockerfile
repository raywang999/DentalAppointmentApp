FROM node:13.14-slim

RUN mkdir -p /services/backend

COPY . /services/backend

RUN cd /services/backend; npm install

WORKDIR /services/backend

EXPOSE 8000

CMD [ "npm", "start" ]

