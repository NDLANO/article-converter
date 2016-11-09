FROM node:6.2.2

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-oembed

# Copy necessary files for installing dependencies
COPY package.json $APP_PATH/

# Run npm install before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN npm install

COPY .babelrc $APP_PATH/
COPY src $APP_PATH/src

WORKDIR $APP_PATH

CMD ["npm", "run", "start-prod"]
