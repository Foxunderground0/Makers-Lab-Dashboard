# Use an official Node.js image as a base
FROM node:lts as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Expose port 6000 to the outside world
EXPOSE 6000

# Command to run the serve command
CMD ["npx", "serve", "-s", "build", "-l", "6000"]
