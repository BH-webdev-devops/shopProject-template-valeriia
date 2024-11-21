# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install typescript globally
RUN npm install -g typescript

# Copy the source code
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Expose the port (if needed)
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]