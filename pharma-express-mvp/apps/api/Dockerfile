FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl tzdata && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build
ENV TZ=America/Bogota NODE_ENV=development
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main.js"]
