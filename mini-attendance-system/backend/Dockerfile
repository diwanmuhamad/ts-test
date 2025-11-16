FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

# copy prisma schema early so we can run `prisma generate` after deps install
COPY prisma ./prisma

RUN npm install

# generate Prisma client for the target platform (alpine/musl)
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .

ENV NODE_ENV=production

# default command (overridden by compose for each service)
CMD ["node"]
