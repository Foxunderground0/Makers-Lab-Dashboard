# Use an official Node.js image as a base
FROM node:lts as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy only the necessary files for building the application
COPY public/ ./public/
COPY src/ ./src/

# Build the React app for production
RUN npm run build

# Expose port 6000 to the outside world
EXPOSE 6000

# Command to run the serve command
CMD ["npx", "serve", "-s", "build", "-l", "6000"]
