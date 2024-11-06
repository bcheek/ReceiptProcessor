FROM node:10.24.1
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]