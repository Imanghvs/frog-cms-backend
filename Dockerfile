FROM node:18.13.0-alpine3.17 As frog-cms-backend-dev
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./nest-cli.json .
COPY ./tsconfig*.json ./
COPY ./src .
RUN npm run build

FROM node:18.13.0-alpine3.17 As frog-cms-backend-prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY --from=frog-cms-backend-dev /usr/src/app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=frog-cms-backend-dev /usr/src/app/dist ./dist
CMD ["node", "dist/main"]