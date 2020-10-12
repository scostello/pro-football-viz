FROM scostello/nodejs-rdkafka:12.18.2-1.4.4 AS base

ENV BUILD_LIBRDKAFKA=0
ENV ROOT_DIRECTORY=/app

WORKDIR ${ROOT_DIRECTORY}

COPY package*.json tsconfig.json ./
RUN npm ci

COPY docker-entrypoint.sh /usr/local/bin

COPY prisma ./prisma
COPY src ./src

#----------------------#
# Debug Target
#----------------------#
FROM base AS debug

ENV NODE_ENV=development

CMD ["-c", "watch"]

#----------------------#
# Build Target
#----------------------#
FROM base AS build

RUN npm run build \
  && apk del build-deps

ENTRYPOINT ["docker-entrypoint.sh"]

#----------------------#
# Release Target
#----------------------#
#FROM build AS release
#
#RUN pwd && ls -al
#
#WORKDIR /app
#
#CMD ["start"]
