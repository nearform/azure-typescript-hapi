FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Set env
ENV NODE_ENV production
ENV HOST "0.0.0.0"
ENV PORT 3000

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
# Build using typescript
RUN npm run postinstall

# Open port to access server
EXPOSE $PORT
# Execute as bash script to pass along env variables
CMD npm start
