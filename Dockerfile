FROM node:lts-alpine

WORKDIR /app

# 1. Copy package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# 2. Copy folder prisma (Sangat Penting!)
COPY prisma ./prisma/

# 3. Install dependencies
RUN npm install

# 4. Generate Prisma Client sebelum build
RUN npx prisma generate

# 5. Copy sisa kode aplikasi
COPY . .

# 6. Jalankan build untuk production
RUN npm run build

# Expose port default Next.js
EXPOSE 3000