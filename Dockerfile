# Dockerfile for mern server

# Base image
FROM node:current-alpine3.14

# working directory
WORKDIR /usr/src/app

# copying package.json code to container
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./.yarnclean ./

# installing the dependencies
RUN yarn install

# COPY other files
COPY . .

EXPOSE 5000
CMD [ "yarn","start" ]
