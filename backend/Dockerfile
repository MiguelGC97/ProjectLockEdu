FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Use other port if not using https
EXPOSE 8080


ENTRYPOINT [ "npm", "run", "db:reset-and-start" ]

# This is the normal use Entry point. Comment this line for the installation, and afterwards uncomment it forever.
# ENTRYPOINT [ "npm", "run", "start" ]