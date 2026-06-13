FROM node:20-alpine AS backend-deps
WORKDIR /app/Backend
COPY Backend/package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine AS frontend-deps
WORKDIR /app/Frontend
COPY Frontend/package*.json ./
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=backend-deps /app/Backend/node_modules ./Backend/node_modules
COPY --from=frontend-deps /app/Frontend/node_modules ./Frontend/node_modules
COPY Backend/package*.json ./Backend/
COPY Backend/src ./Backend/src
COPY Backend/scripts ./Backend/scripts
COPY Frontend/package*.json ./Frontend/
COPY Frontend/index.html ./Frontend/
COPY Frontend/postcss.config.js ./Frontend/
COPY Frontend/tailwind.config.js ./Frontend/
COPY Frontend/vite.config.js ./Frontend/
COPY Frontend/vitest.config.js ./Frontend/
COPY Frontend/public ./Frontend/public
COPY Frontend/src ./Frontend/src
RUN npm --prefix Frontend run build

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/Backend ./Backend
COPY --from=build /app/Frontend/dist ./Frontend/dist
EXPOSE 8080
CMD ["node", "Backend/src/server.js"]
