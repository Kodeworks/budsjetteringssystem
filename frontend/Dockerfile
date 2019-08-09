FROM node:latest

#RUN useradd frontend -u 1000 -U -s /bin/false

# Install storybook
#RUN npx -p @storybook/cli

WORKDIR /frontend/code

COPY . ./

EXPOSE 3000

RUN yarn install

CMD ["yarn", "start"]

#USER frontend
