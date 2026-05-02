FROM node:lts-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src ./src

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]