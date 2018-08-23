FROM node:8.11-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-converter

RUN npm install pm2 -g

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

COPY .babelrc $APP_PATH/
COPY src $APP_PATH/src

ENV NODE_ENV=production

RUN yarn build

CMD ["pm2-runtime", "-i", "max", "build/server.js", "|", "bunyan"]
