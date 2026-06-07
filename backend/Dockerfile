# Use the official Node.js environment
FROM node:18

# Set the working directory inside the cloud computer
WORKDIR /app

# Copy your package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Hugging Face requires port 7860
ENV PORT=7860
EXPOSE 7860

# Start the Node server (adjust 'index.js' if your main file is named differently, like 'server.js')
CMD ["node", "index.js"]