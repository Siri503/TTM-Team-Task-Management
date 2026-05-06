FROM node:18-alpine

WORKDIR /app

# Build frontend
FROM node:18-alpine as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Build backend
FROM node:18-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .
COPY --from=client-build /app/client/build ./public

EXPOSE 5000

CMD ["node", "server.js"]
