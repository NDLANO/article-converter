FROM node:6.10.0-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-converter

#Install yarn
ENV YARN_VERSION 0.21.3
ADD https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v${YARN_VERSION}.tar.gz /opt/yarn.tar.gz
RUN cd /opt/ && tar xf yarn.tar.gz && mv dist yarn && rm yarn.tar.gz
ENV PATH $PATH:/opt/yarn/bin/

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

CMD ["npm", "run", "start-prod"]
