FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3000

# Inicia Cloudflared e a API
ENTRYPOINT ["sh", "-c", "cloudflared tunnel --no-autoupdate run --token eyJhIjoiYTIyYjI0Mjk0NjViMzg4YzczMzA5YWU0ZmQzNWFiMDIiLCJ0IjoiMmUyYmNkNGQtY2I2OC00NmE3LWE4MzEtMTM0ZTFlNDAwOTRjIiwicyI6Ik5ERXdORGhrTnprdE1UQTJaQzAwT1RVMUxXRmlObVl0TW1Nd056a3dPR000WmpBeiJ9 & yarn dev"]
