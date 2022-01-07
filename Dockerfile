FROM node:alpine
WORKDIR /app
RUN npm install express cors browserify
COPY app.js .
ENTRYPOINT ["node", "app.js"]
