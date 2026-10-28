FROM node:24-alpine AS build
WORKDIR /app
# Dependencias en una capa propia: si solo cambia el código no se vuelven a instalar.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# docker build --target test . pasa el lint y los tests sin necesitar Node en la máquina.
FROM build AS test
RUN npm run lint && npm test

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
