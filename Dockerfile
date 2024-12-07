FROM node:16

WORKDIR /app
ENV PORT 3000
ENV HOST 0.0.0.0

COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start"]
