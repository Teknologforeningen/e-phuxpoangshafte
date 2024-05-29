# Use the specified base image
FROM mcr.microsoft.com/devcontainers/universal:2-linux

# Install Node.js (example uses Node.js 14, adjust as needed)
ARG NODE_VERSION=16
RUN curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install yarn
RUN npm install -g yarn

# Install MongoDB
RUN apt-get update \
    && apt-get install -y gnupg \
    && curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - \
    && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*