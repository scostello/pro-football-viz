FROM quay.io/sean.costello/nodejs-rdkafka:12.14.1-1.3.0 AS base

ENV BUILD_LIBRDKAFKA=0 \
  ROOT_DIRECTORY=/opt

WORKDIR ${ROOT_DIRECTORY}

COPY . .

RUN npm ci

FROM base AS build

COPY --from=base /opt/packages/pfa-api/docker-entrypoint.sh /usr/local/bin

RUN npm run lerna -- run build \
  && apk del build-deps

ENTRYPOINT ["docker-entrypoint.sh"]

FROM build AS debug

ENV NODE_ENV=development

WORKDIR /opt/packages/pfa-api

CMD ["watch"]

FROM quay.io/sean.costello/nodejs-rdkafka:12.14.1-1.3.0 AS release

RUN pwd && ls -al

WORKDIR /opt/app

COPY --from=build /opt/packages/pfa-api/docker-entrypoint.sh /usr/local/bin
COPY --from=build /opt/packages/pfa-api/package.json ./package.json
COPY --from=build /opt/packages/pfa-api/node_modules ./node_modules
COPY --from=build /opt/packages/pfa-api/dist ./dist

CMD ["start"]
