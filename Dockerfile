# Use Node.js base image
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Use a lightweight Node.js image for the final build
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy built app from the previous stage
COPY --from=build /app/build /app/build

COPY package*.json /app/build/

# Expose the port that the SvelteKit app runs on
EXPOSE 3000

# Command to run the SvelteKit app
CMD ["node", "-r", "dotenv/config", "./build"]
