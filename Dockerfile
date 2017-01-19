FROM node:6.2.2

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-converter

# Copy necessary files for installing dependencies
COPY package.json $APP_PATH/

# Run npm install before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN npm install

# Copy necessary source files for server and client build
COPY .babelrc $APP_PATH/
COPY src $APP_PATH/src
COPY public $APP_PATH/public

# Run tests and lint-checks
COPY .eslintrc.js $APP_PATH/
RUN npm run lint
RUN npm test

# Build client code
WORKDIR $APP_PATH

CMD ["npm", "run", "start-prod"]
