FROM node:16.8.0-slim

RUN mkdir -p /services/frontend

COPY . /services/frontend

RUN chmod 777 /services/frontend/start.sh

RUN cd /services/frontend; yarn install

WORKDIR /services/frontend

EXPOSE 3000

CMD [ "yarn", "start" ]

