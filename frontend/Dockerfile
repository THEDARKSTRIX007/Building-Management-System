# -------- BUILD STAGE --------
FROM node:20 AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js for production
RUN npm run build

# -------- RUN STAGE --------
FROM node:20
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app ./

EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
