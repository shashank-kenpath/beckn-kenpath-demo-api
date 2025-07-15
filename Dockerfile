# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S beckn -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ] ; then npm ci ; else npm ci --only=production ; fi && npm cache clean --force

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R beckn:nodejs /app
USER beckn

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]