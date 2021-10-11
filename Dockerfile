FROM node:14-alpine
RUN apk add curl
COPY --chown=node:node . /var/app
USER node
WORKDIR /var/app
RUN npm install
CMD npm run-script start
EXPOSE 3000
HEALTHCHECK CMD curl http://localhost:3334/auth/whoami
