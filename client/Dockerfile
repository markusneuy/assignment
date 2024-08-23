# -------------------------------------------------------------------------------------------------
# BASE ENVIRONMENT
# -------------------------------------------------------------------------------------------------
FROM node:22-alpine AS base

ENV WORKDIR=/usr/src/app
WORKDIR ${WORKDIR}

# -------------------------------------------------------------------------------------------------
# COMPILER ENVIRONMENT
# -------------------------------------------------------------------------------------------------
FROM base AS compiler

ENV NODE_ENV=development

COPY --chown=node:node ./package*.json ./

RUN npm install

COPY --chown=node:node ./ ${WORKDIR}/

RUN npm run build

# -------------------------------------------------------------------------------------------------
# DEVELOPMENT ENVIRONMENT
# -------------------------------------------------------------------------------------------------
FROM compiler AS development

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
