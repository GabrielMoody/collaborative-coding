FROM node:22-alpine

WORKDIR /app
COPY . /app/
COPY package.json package-lock.json ./

RUN npm install 

RUN chmod +x /app/init-replica.sh
RUN sh -c /app/init-replica.sh
CMD [ "npm", "run", "start" ]