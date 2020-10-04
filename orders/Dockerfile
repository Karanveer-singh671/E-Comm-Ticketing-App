FROM node:alpine

WORKDIR /app
COPY package.json .
# change to only prod since installed in memory mongo db server 
# do not want to reinstall each time in the image since running tests locally
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]