FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5002

CMD ["node", "src/index.js"]