FROM node:18.12-alpine as builder

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
FROM node:18.12-alpine

RUN apk add py-pip jq && pip install awscli
COPY run-article-converter.sh /

WORKDIR /home/app/article-converter
COPY --from=builder /home/app/article-converter/build build
COPY --from=builder /home/app/article-converter/node_modules node_modules

ENV NODE_ENV=production

CMD ["/run-article-converter.sh", "node build/server.js '|' bunyan"]
