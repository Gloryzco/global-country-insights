FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY . .

RUN npm install && npm run build && npm run migration:run

# RUN rm -rf ./src

EXPOSE 3009

CMD ["node", "dist/src/main.js"]
