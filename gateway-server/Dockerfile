# 공통 NestJS용 Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env.production .env.production

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
