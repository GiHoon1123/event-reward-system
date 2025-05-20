# 공통 NestJS용 Dockerfile
FROM node:18

WORKDIR /app

# netcat 설치를 위해 패키지 리스트 업데이트 후 netcat 설치
RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY .env.production .env.production

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
