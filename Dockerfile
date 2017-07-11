FROM node:8.1.2-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-converter

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

COPY .babelrc $APP_PATH/
COPY src $APP_PATH/src

RUN yarn build

CMD ["yarn", "start-prod"]
