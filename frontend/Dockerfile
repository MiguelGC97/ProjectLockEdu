FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Use other port if not using https
EXPOSE 5173

CMD ["npm", "run", "app:dev"]