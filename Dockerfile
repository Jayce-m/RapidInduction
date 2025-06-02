# TODO: Vibe coded too much of this dockerfile and its a mess now. Need to refactor at some point

# Use Bun as base image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base as deps
COPY package*.json ./
COPY server/package*.json ./server/
COPY frontend/package*.json ./frontend/

# Install server dependencies
RUN cd server && bun install --frozen-lockfile

# Install frontend dependencies with special handling for rollup
RUN cd frontend && \
    # Remove any existing node_modules and package-lock.json
    rm -rf node_modules package-lock.json && \
    # Install dependencies with Bun
    bun install --frozen-lockfile && \
    # Explicitly install the rollup Linux dependency
    bun add @rollup/rollup-linux-x64-gnu

# Build frontend
FROM base as frontend-builder
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend ./frontend
RUN cd frontend && bun run build

# Build backend
FROM base as backend-builder
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server ./server
RUN cd server && bun build ./index.ts --outfile ./dist/index.js && mkdir -p ./dist

# Production image
FROM base
WORKDIR /app

# Copy built backend and its dependencies
COPY --from=deps /app/server/node_modules ./node_modules
COPY --from=backend-builder /app/server/dist/index.js ./index.js
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy server data
COPY server/data ./data

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server
CMD ["bun", "index.js"] 