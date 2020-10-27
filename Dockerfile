FROM node:12-alpine
WORKDIR /app
ENV NODE_ENV production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .

CMD ["node", "./src/index.js"]
