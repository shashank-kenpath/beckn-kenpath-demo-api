# Docker Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the Application
```bash
docker-compose up -d
```

### 2. Check if Everything is Running
```bash
docker-compose ps
```

### 3. Test the API
```bash
# Health check
curl http://localhost:3000/health

# Get categories
curl http://localhost:3000/categories

# Search for products
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"message": {"intent": {"item": {"descriptor": {"name": "tomato"}}}}}'
```

## 📋 Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Connect to database
docker-compose exec postgres psql -U postgres -d beckn_agriculture

# Access API container
docker-compose exec beckn-api sh
```

## 🔧 Troubleshooting

### If containers fail to start:
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Clean up and restart
docker-compose down -v
docker-compose up -d
```

### If database connection fails:
```bash
# Wait for database to be ready
docker-compose exec postgres pg_isready -U postgres -d beckn_agriculture

# Check database logs
docker-compose logs postgres
```

## 🌐 Access Points

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:5432 (username: postgres, password: password)

## 📚 More Information

For detailed documentation, see [DOCKER_README.md](DOCKER_README.md)