FROM node:25-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src ./src

RUN npm install -g pnpm && \
    pnpm install && \
    pnpm run build && \
    pnpm prune --prod

FROM node:25-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000

CMD ["node", "dist/server.js"]

# NOT MULTI STAGED BUILD
# FROM node:25-alpine

# WORKDIR /app

# COPY package.json pnpm-lock.yaml tsconfig.json ./
# COPY src ./src

# RUN npm install -g pnpm && \
#     pnpm install && \
#     pnpm run build

# EXPOSE 3000

# CMD ["node", "dist/server.js"]
