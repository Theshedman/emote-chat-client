# Use Node.js base image
FROM node:lts-alpine

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

# Expose the port that the SvelteKit app runs on
EXPOSE 3000

# Command to run the SvelteKit app
CMD ["node", "-r", "dotenv/config", "./build"]
