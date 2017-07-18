FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Set env
ENV NODE_ENV production
ENV HOST "0.0.0.0"

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN npm run postinstall

EXPOSE 3000
# EXPOSE $PORT
# CMD [ "npm", "start" ]
# ENTRYPOINT npm start
CMD npm start
