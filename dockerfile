# Dependencias
FROM node:21-alpine3.19  as deps
WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install


# Builder - Cnstruindo la aplicacion
FROM node:21-alpine3.19  as build
WORKDIR /usr/src/app

# Copiar las dependencias
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copiar todo el codigo fuente
COPY . .

RUN npm run build

# Dejar solo dependencias de produccion
RUN npm ci -f --only=production && npm cache clean --force



# Crear la imagen final de docker
FROM node:21-alpine3.19  as prod
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production

# USER node

EXPOSE 3000

CMD [ "node", "dist/main.js"]