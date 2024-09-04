FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["./wait-for-it.sh", "127.0.0.1:5432", "--", "yarn", "start"]

