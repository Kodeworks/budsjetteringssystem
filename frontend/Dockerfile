FROM node:8-jessie

#RUN useradd frontend -u 1000 -U -s /bin/false

# Install storybook
#RUN npx -p @storybook/cli

WORKDIR /frontend/code

COPY . ./

EXPOSE 3000

CMD ["yarn", "start"]

#USER frontend
