FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

RUN npm install -g @nestjs/cli

COPY . .
RUN npm run build

FROM node:22-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/main"]
