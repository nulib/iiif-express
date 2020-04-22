FROM node:12-alpine
MAINTAINER Michael B. Klein
COPY --chown=node:node . /var/app
USER node
WORKDIR /var/app
RUN yarn install
CMD yarn start
EXPOSE 3000
HEALTHCHECK CMD wget -q http://localhost:3334/auth/whoami
