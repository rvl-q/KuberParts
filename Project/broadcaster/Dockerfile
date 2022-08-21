FROM node:18.2.0-bullseye-slim

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --omit=dev

COPY . .
CMD [ "node", "app.js" ]