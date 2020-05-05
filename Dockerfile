FROM node:13-alpine
RUN apk add curl
COPY --chown=node:node . /var/app
USER node
WORKDIR /var/app
RUN yarn install
CMD yarn start
EXPOSE 3000
HEALTHCHECK CMD curl http://localhost:3334/auth/whoami
