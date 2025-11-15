###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18.16.0-alpine3.17 AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.

COPY --chown=node:node package.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
# RUN npm ci
RUN npm install --ignore-scripts

# Bundle app source

COPY --chown=node:node ./libs ./libs
COPY --chown=node:node ./nest-cli.json ./nest-cli.json
COPY --chown=node:node ./tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node ./tsconfig.json ./tsconfig.json

COPY --chown=node:node ./apps/micro-services.ts ./apps/micro-services.ts
COPY --chown=node:node ./apps/port-config.ts ./apps/port-config.ts
COPY --chown=node:node ./apps/taginvdetail ./apps/taginvdetail

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18.16.0-alpine3.17 AS build

WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ./apps/taginvdetail ./apps/taginvdetail
COPY --chown=node:node ./apps/micro-services.ts ./apps/micro-services.ts
COPY --chown=node:node ./apps/port-config.ts ./apps/port-config.ts

COPY --chown=node:node ./libs ./libs
COPY --chown=node:node ./nest-cli.json ./nest-cli.json
COPY --chown=node:node ./tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node ./tsconfig.json ./tsconfig.json


# Run the build command which creates the production bundle
RUN npm run build taginvdetail


# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production --omit=dev --ignore-scripts && npm cache clean --force

# RUN npm audit fix --force
# RUN npm install --omit=dev && npm cache clean --force

USER node

###################
# PRODUCTION  Orders
###################

FROM node:18.16.0-alpine3.17 AS production

LABEL maintainer="Lahu Waghamre<lahu.waghmare@nic.in>"

WORKDIR /usr/src/app
# Add curl utility to local troubleshooting.
RUN apk --no-cache add curl

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

RUN npm install --ignore-scripts -g pm2 

USER node


# Start the server for order microservice using the production build
CMD [ "pm2-runtime", "dist/apps/taginvdetail/main.js" ]

# EXPOSE 3002



