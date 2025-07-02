# Usa una imagen de Node.js slim para producción
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json primero para aprovechar el caché de Docker
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm ci --only=production

# Copia el resto del código de tu aplicación
COPY . .

# Expone el puerto en el que escucha tu aplicación
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["node", "dist/main.js"]
 # Reemplaza con tu archivo de entrada real (ej. server.js, app.js)
