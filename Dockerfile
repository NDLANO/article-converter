FROM node:6.2.2

#Add app user to enable running the container as an unprivileged user
RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
ENV APP_PATH=$HOME/article-oembed

# Copy necessary files for installing dependencies
COPY package.json $APP_PATH/
RUN chown -R app:app $HOME/*

# Run npm install before src copy to enable better layer caching
USER app
WORKDIR $APP_PATH
RUN npm install

# Copy necessary source files for server and client build
USER root
COPY .babelrc $APP_PATH/
COPY src $APP_PATH/src

RUN chown -R app:app $HOME/*

# Build client code
USER app
WORKDIR $APP_PATH

CMD ["npm", "run", "start-prod"]
