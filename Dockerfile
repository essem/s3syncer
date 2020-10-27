FROM node:12-alpine

WORKDIR /app

# awscli
RUN apk add --no-cache python3 py3-pip
RUN pip3 install --upgrade pip
RUN pip3 install awscli
RUN rm -rf /var/cache/apk/*
RUN aws --version

# app
ENV NODE_ENV production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .

CMD ["node", "./src/index.js"]
