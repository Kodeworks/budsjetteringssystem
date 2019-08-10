FROM node:12.8-alpine

WORKDIR /frontend/code

# Install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Copy in the project files
COPY . ./

USER node

CMD ["yarn", "start"]
