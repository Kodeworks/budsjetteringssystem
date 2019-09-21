FROM node:12.8-alpine

WORKDIR /frontend/code

ARG REACT_APP_BASE_URL

# Install dependencies
# We don't want the modules to be installed in the workdir,
# which is overwritten when we mount the host volume,
# so we install it in the parent directory
RUN mkdir ../static
COPY package.json ./
COPY yarn.lock ./
RUN yarn --modules-folder /frontend/node_modules
ENV PATH="$PATH:/frontend/node_modules/.bin"

# Copy in the project files
COPY . ./

RUN yarn build
RUN mv build ../

USER node
