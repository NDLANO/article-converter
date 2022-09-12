FROM node:14.20-alpine as builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-converter

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

COPY .babelrc tsconfig.json $APP_PATH/
COPY src $APP_PATH/src

RUN yarn run build

### Run stage
FROM node:14.20-alpine

RUN apk add py-pip jq && pip install awscli
COPY run-article-converter.sh /

RUN npm install pm2 -g
WORKDIR /home/app/article-converter
COPY --from=builder /home/app/article-converter/build build
COPY --from=builder /home/app/article-converter/node_modules node_modules

ENV NODE_ENV=production

CMD ["/run-article-converter.sh", "pm2-runtime -i max build/server.js '|' bunyan"]
