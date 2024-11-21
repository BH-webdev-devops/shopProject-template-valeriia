# Use a Node.js base image
FROM node:16

# Define ARGs
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_TYPE
ARG PORT

# Use ARGs in ENV
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_TYPE=${DB_TYPE}
ENV PORT=${PORT}

# Set the working directory
WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript source code
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript to JavaScript
RUN tsc

# Expose the port the app will run on
EXPOSE 8080

# Start the application (in this case, the compiled JavaScript file)
CMD ["node", "dist/index.js"]