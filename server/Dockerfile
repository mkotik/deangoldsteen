FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Expose port 8080
EXPOSE 8080

# Start command
CMD ["npm", "start"] 