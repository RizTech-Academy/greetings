# ---- Stage 1: install production dependencies ----
# A separate stage means the final image never contains npm's cache, dev
# dependencies, or build tooling — only what is needed to run.
FROM node:20-alpine AS deps
WORKDIR /app
# Copy only the manifest first, so this layer is cached and re-runs only when
# dependencies actually change — not on every source edit.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Stage 2: the runtime image ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Bring in the installed dependencies from the deps stage, then the source.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
# Run as the built-in non-root 'node' user, never as root.
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
