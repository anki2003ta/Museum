# Use a newer official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app/MUESEUM

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env.example file to .env
COPY .env.example .env

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["node", "app.js"]
