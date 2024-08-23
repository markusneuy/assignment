# -------------------------------------------------------------------------------------------------
# BASE ENVIRONMENT
# -------------------------------------------------------------------------------------------------
FROM node:22-alpine AS base

ENV WORKDIR=/usr/src/app
WORKDIR ${WORKDIR}

COPY ./.Dockerfile/ /

RUN apk add --no-cache tini && \
  chmod a+x /usr/local/bin/docker-entrypoint.sh && \
  ln -s /usr/local/bin/docker-entrypoint.sh /docker-entrypoint.sh && \
  chown -R node:node /usr/src/app/

ENTRYPOINT ["tini", "-v", "--","docker-entrypoint.sh"]

# -------------------------------------------------------------------------------------------------
# COMPILER ENVIRONMENT
# -------------------------------------------------------------------------------------------------
FROM base AS compiler

USER node

ENV NODE_ENV=development

COPY --chown=node:node ./package*.json ./

RUN npm install

COPY --chown=node:node ./ ${WORKDIR}/

RUN npm run build

# -------------------------------------------------------------------------------------------------
# DEVELOPMENT ENVIRONMENT
# -------------------------------------------------------------------------------------------------
FROM compiler AS development

USER node

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
