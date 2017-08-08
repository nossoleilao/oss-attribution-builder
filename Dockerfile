FROM node:6 as build
WORKDIR /build

COPY ./package.json ./package-lock.json ./
RUN NPM_CONFIG_LOGLEVEL=warn npm install

COPY ./ ./
RUN NODE_ENV=production ./node_modules/.bin/gulp


FROM node:6
ENV NODE_ENV production
CMD ["node", "./server/localserver.js"]
WORKDIR /opt/app

COPY ./package.json ./package-lock.json ./
RUN NPM_CONFIG_LOGLEVEL=warn npm install --production
COPY --from=build /build/build/ ./
