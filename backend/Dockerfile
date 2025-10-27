# Use a Node.js image
FROM node:latest

# Maintainer label
LABEL authors="revelation"

# Set the working directory in the container
WORKDIR /usr/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 3010

# Define the start command
CMD ["npm", "start"]
