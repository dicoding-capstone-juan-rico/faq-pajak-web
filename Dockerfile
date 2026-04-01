FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

# Jalankan build untuk production
RUN npm run build

# Expose port default Next.js
EXPOSE 3000

# Jalankan server production
CMD ["npm", "run", "start"]