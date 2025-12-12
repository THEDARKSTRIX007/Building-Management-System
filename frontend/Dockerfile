FROM node:20 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NODE_ENV=production

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]

