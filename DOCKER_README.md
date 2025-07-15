# Docker Setup for Beckn Agriculture API

This document provides comprehensive instructions for running the Beckn Agriculture API using Docker and Docker Compose.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB of available RAM
- At least 5GB of available disk space

## 🏗️ Architecture

The Docker setup includes:

- **beckn-api**: Node.js 18 application container
- **postgres**: PostgreSQL 15 database container
- **beckn-network**: Custom bridge network for service communication
- **postgres_data**: Persistent volume for database storage

## 🚀 Quick Start

### 1. Development Setup

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd beckn-kenpath-demo-api

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 2. Production Setup

```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# Or with environment variables
POSTGRES_PASSWORD=your_secure_password \
API_PORT=3000 \
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 File Structure

```
beckn-kenpath-demo-api/
├── Dockerfile                    # Node.js application container
├── docker-compose.yml           # Development configuration
├── docker-compose.override.yml  # Development overrides
├── docker-compose.prod.yml      # Production configuration
├── .dockerignore               # Files excluded from build
├── .env.docker                 # Docker environment variables
└── docker/
    └── postgres/
        └── init.sql            # Database initialization script
```

## 🔧 Configuration

### Environment Variables

The following environment variables can be configured:

#### Database Configuration
- `DB_HOST=postgres` (container name)
- `DB_PORT=5432`
- `DB_NAME=beckn_agriculture`
- `DB_USER=postgres`
- `DB_PASSWORD=password`

#### API Configuration
- `PORT=3000`
- `NODE_ENV=production`

#### Beckn Configuration
- `BPP_ID=kenpath-agriculture-bpp`
- `BPP_URI=https://bpp-client.kenpath.ai`
- `BAP_CALLBACK_URL=https://bpp-client.kenpath.ai/on_search`

### Custom Environment File

Create a `.env` file in the project root:

```env
# Database
POSTGRES_PASSWORD=your_secure_password

# API
API_PORT=3000
NODE_ENV=production

# Beckn
BPP_ID=your-bpp-id
BPP_URI=https://your-bpp-uri.com
BAP_CALLBACK_URL=https://your-callback-url.com/on_search
```

## 🛠️ Development Workflow

### Starting Services

```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Start specific service
docker-compose up beckn-api
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f beckn-api
docker-compose logs -f postgres
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v

# Stop specific service
docker-compose stop beckn-api
```

### Rebuilding Images

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build beckn-api

# Rebuild without cache
docker-compose build --no-cache
```

## 🔍 Debugging

### Accessing Containers

```bash
# Access API container
docker-compose exec beckn-api sh

# Access PostgreSQL container
docker-compose exec postgres psql -U postgres -d beckn_agriculture
```

### Database Operations

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d beckn_agriculture

# Run SQL commands
docker-compose exec postgres psql -U postgres -d beckn_agriculture -c "SELECT * FROM farmers;"

# Backup database
docker-compose exec postgres pg_dump -U postgres beckn_agriculture > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d beckn_agriculture < backup.sql
```

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Check database connection
docker-compose exec postgres pg_isready -U postgres -d beckn_agriculture
```

## 📊 Monitoring

### Container Status

```bash
# View running containers
docker-compose ps

# View resource usage
docker stats

# View container details
docker-compose exec beckn-api ps aux
```

### Application Logs

```bash
# API logs
docker-compose logs beckn-api

# Database logs
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f --tail=100
```

## 🔒 Security Considerations

### Production Deployment

1. **Change Default Passwords**:
   ```bash
   POSTGRES_PASSWORD=your_secure_password docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Use Secrets Management**:
   - Store sensitive data in Docker secrets
   - Use environment variable files with restricted permissions

3. **Network Security**:
   - Remove port mappings for internal services
   - Use reverse proxy for external access

4. **Resource Limits**:
   - Set memory and CPU limits in production
   - Monitor resource usage

### Example Production Command

```bash
# Set secure password and start
export POSTGRES_PASSWORD=$(openssl rand -base64 32)
export BPP_ID=your-production-bpp-id
export BPP_URI=https://your-production-domain.com

docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### API Testing

```bash
# Wait for services to be ready
docker-compose up -d
sleep 30

# Test health endpoint
curl http://localhost:3000/health

# Test categories endpoint
curl http://localhost:3000/categories

# Test search endpoint
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"message": {"intent": {"item": {"descriptor": {"name": "tomato"}}}}}'
```

### Database Testing

```bash
# Check if tables exist
docker-compose exec postgres psql -U postgres -d beckn_agriculture -c "\dt"

# Check sample data
docker-compose exec postgres psql -U postgres -d beckn_agriculture -c "SELECT COUNT(*) FROM farmers;"
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Change port mapping
   API_PORT=3001 docker-compose up -d
   ```

2. **Database Connection Failed**:
   ```bash
   # Check if PostgreSQL is ready
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Out of Disk Space**:
   ```bash
   # Clean up unused images and volumes
   docker system prune -a
   docker volume prune
   ```

4. **Permission Issues**:
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Reset Everything

```bash
# Stop all services and remove everything
docker-compose down -v --remove-orphans

# Remove all images
docker-compose down --rmi all

# Clean up system
docker system prune -a

# Start fresh
docker-compose up -d
```

## 📈 Performance Optimization

### Production Optimizations

1. **Multi-stage Dockerfile** (already implemented)
2. **Resource Limits** (configured in prod compose)
3. **Health Checks** (implemented)
4. **Logging Configuration** (configured)

### Scaling

```bash
# Scale API service
docker-compose up -d --scale beckn-api=3

# Use load balancer for multiple instances
# (requires additional configuration)
```

## 🔄 Updates and Maintenance

### Updating Images

```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

### Database Migrations

```bash
# Run custom migration script
docker-compose exec beckn-api npm run migrate

# Or run Node.js scripts
docker-compose exec beckn-api node scripts/setup-database.js
```

## 📞 Support

For issues related to Docker setup:

1. Check logs: `docker-compose logs`
2. Verify configuration: `docker-compose config`
3. Check system resources: `docker system df`
4. Review this documentation

For application-specific issues, refer to the main README.md file.

---

**Built with ❤️ for the Beckn Agriculture Network**