# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies for both frontend and backend
FROM base as deps
COPY package*.json ./
COPY server/package*.json ./server/
COPY frontend/package*.json ./frontend/
RUN cd server && bun install --frozen-lockfile
RUN cd frontend && bun install --frozen-lockfile

# Build frontend
FROM base as frontend-builder
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend ./frontend
RUN cd frontend && bun run build

# Build backend
FROM base as backend-builder
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server ./server
RUN cd server && bun build ./index.ts --outdir=../dist --target=node

# Production image
FROM base
WORKDIR /app

# Copy node_modules and built files
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the server
CMD ["bun", "dist/index.js"] 