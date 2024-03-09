# Use an official Node.js image as a base
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ENV PORT=8000
# Expose port 80 to the outside world
EXPOSE $PORT

# Command to run the Nginx web server
CMD ["npm", "start"]
