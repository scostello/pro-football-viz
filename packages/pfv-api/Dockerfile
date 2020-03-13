#----------------------#
# GLibC Target
#----------------------#
FROM scostello/nodejs-rdkafka:12.16.1-1.3.0 AS glibc

ENV LANG=C.UTF-8
ENV GLIBC_VERSION 2.30-r0

# Download and install glibc
RUN apk add --update curl && \
	curl -Lo /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
	curl -Lo glibc.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk" && \
	curl -Lo glibc-bin.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk" && \
	apk add glibc-bin.apk glibc.apk && \
	/usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib && \
	echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf && \
	apk del curl && \
	rm -rf glibc.apk glibc-bin.apk /var/cache/apk/*

RUN apk add g++ make && rm -rf /var/cache/apk/*

#----------------------#
# Base Target
#----------------------#
FROM glibc AS base

ENV BUILD_LIBRDKAFKA=0
ENV ROOT_DIRECTORY=/app

WORKDIR ${ROOT_DIRECTORY}

COPY package*.json tsconfig.json prisma ./
COPY prisma ./prisma
COPY src ./src
COPY docker-entrypoint.sh /usr/local/bin

RUN npm ci

#----------------------#
# Build Target
#----------------------#
FROM base AS build

RUN npm run build \
  && apk del build-deps

ENTRYPOINT ["docker-entrypoint.sh"]

#----------------------#
# Debug Target
#----------------------#
FROM build AS debug

ENV NODE_ENV=development

CMD ["-c", "watch"]

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
