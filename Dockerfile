# Use a base image with Node.js installed
FROM node:16.13-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React.js application
RUN npm run build

# Set the command to start the development server
CMD ["npm", "start"]