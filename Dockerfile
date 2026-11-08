# 1. Base Image - Lightweight Node.js Alpine
FROM node:20-alpine AS builder

# 2. Set Working Directory
WORKDIR /app

# 3. Install Dependencies
COPY package*.json ./
RUN npm ci

# 4. Copy Source Code
COPY . .

# 5. Build TypeScript Code
RUN npm run build

# 6. Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# 7. Expose Port & Start Server
EXPOSE 5000
CMD ["node", "dist/app.js"]
