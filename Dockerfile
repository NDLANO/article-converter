FROM node:8.0.0-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-converter

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

COPY .babelrc .eslintrc.js $APP_PATH/
COPY src $APP_PATH/src

# Run tests and lint-checks
RUN yarn run lint
RUN yarn test

CMD ["yarn", "run", "start-prod"]
