#!/bin/bash

# Docker Management Scripts for Beckn Agriculture API
# This script provides convenient commands for Docker operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
}

# Development commands
dev_start() {
    print_header "Starting Development Environment"
    check_docker
    check_docker_compose
    
    print_status "Building and starting services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    print_status "Checking service health..."
    docker-compose ps
    
    print_status "Development environment is ready!"
    print_status "API: http://localhost:3000"
    print_status "Health Check: http://localhost:3000/health"
    print_status "Database: localhost:5432"
}

dev_stop() {
    print_header "Stopping Development Environment"
    docker-compose down
    print_status "Development environment stopped."
}

dev_restart() {
    print_header "Restarting Development Environment"
    dev_stop
    dev_start
}

dev_logs() {
    print_header "Viewing Development Logs"
    docker-compose logs -f
}

# Production commands
prod_start() {
    print_header "Starting Production Environment"
    check_docker
    check_docker_compose
    
    if [ -z "$POSTGRES_PASSWORD" ]; then
        print_warning "POSTGRES_PASSWORD not set. Using default password."
        print_warning "For production, set: export POSTGRES_PASSWORD=your_secure_password"
    fi
    
    print_status "Building and starting production services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_status "Waiting for services to be ready..."
    sleep 15
    
    print_status "Checking service health..."
    docker-compose -f docker-compose.prod.yml ps
    
    print_status "Production environment is ready!"
    print_status "API: http://localhost:${API_PORT:-3000}"
}

prod_stop() {
    print_header "Stopping Production Environment"
    docker-compose -f docker-compose.prod.yml down
    print_status "Production environment stopped."
}

prod_logs() {
    print_header "Viewing Production Logs"
    docker-compose -f docker-compose.prod.yml logs -f
}

# Database commands
db_connect() {
    print_header "Connecting to Database"
    docker-compose exec postgres psql -U postgres -d beckn_agriculture
}

db_backup() {
    print_header "Creating Database Backup"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec postgres pg_dump -U postgres beckn_agriculture > "$BACKUP_FILE"
    print_status "Database backup created: $BACKUP_FILE"
}

db_restore() {
    if [ -z "$1" ]; then
        print_error "Usage: $0 db-restore <backup_file>"
        exit 1
    fi
    
    print_header "Restoring Database from $1"
    print_warning "This will overwrite existing data. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose exec -T postgres psql -U postgres -d beckn_agriculture < "$1"
        print_status "Database restored from $1"
    else
        print_status "Database restore cancelled."
    fi
}

db_reset() {
    print_header "Resetting Database"
    print_warning "This will delete all data and recreate tables. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose exec beckn-api node scripts/setup-database.js
        docker-compose exec beckn-api node scripts/seed-data.js
        print_status "Database reset completed."
    else
        print_status "Database reset cancelled."
    fi
}

# Utility commands
build() {
    print_header "Building Docker Images"
    docker-compose build --no-cache
    print_status "Build completed."
}

clean() {
    print_header "Cleaning Docker Resources"
    print_warning "This will remove stopped containers, unused networks, and dangling images."
    print_warning "Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker system prune -f
        print_status "Cleanup completed."
    else
        print_status "Cleanup cancelled."
    fi
}

clean_all() {
    print_header "Deep Cleaning Docker Resources"
    print_warning "This will remove ALL containers, images, volumes, and networks."
    print_warning "This action cannot be undone. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -a -f --volumes
        print_status "Deep cleanup completed."
    else
        print_status "Deep cleanup cancelled."
    fi
}

status() {
    print_header "Docker Status"
    print_status "Running containers:"
    docker-compose ps
    echo
    print_status "Docker system info:"
    docker system df
}

health() {
    print_header "Health Check"
    print_status "Checking API health..."
    if curl -s http://localhost:3000/health > /dev/null; then
        print_status "✓ API is healthy"
    else
        print_error "✗ API is not responding"
    fi
    
    print_status "Checking database connection..."
    if docker-compose exec postgres pg_isready -U postgres -d beckn_agriculture > /dev/null 2>&1; then
        print_status "✓ Database is ready"
    else
        print_error "✗ Database is not ready"
    fi
}

# Help function
show_help() {
    echo "Docker Management Scripts for Beckn Agriculture API"
    echo
    echo "Usage: $0 <command>"
    echo
    echo "Development Commands:"
    echo "  dev-start     Start development environment"
    echo "  dev-stop      Stop development environment"
    echo "  dev-restart   Restart development environment"
    echo "  dev-logs      View development logs"
    echo
    echo "Production Commands:"
    echo "  prod-start    Start production environment"
    echo "  prod-stop     Stop production environment"
    echo "  prod-logs     View production logs"
    echo
    echo "Database Commands:"
    echo "  db-connect    Connect to database"
    echo "  db-backup     Create database backup"
    echo "  db-restore    Restore database from backup"
    echo "  db-reset      Reset database with sample data"
    echo
    echo "Utility Commands:"
    echo "  build         Build Docker images"
    echo "  clean         Clean unused Docker resources"
    echo "  clean-all     Remove all Docker resources (destructive)"
    echo "  status        Show Docker status"
    echo "  health        Check service health"
    echo "  help          Show this help message"
    echo
    echo "Examples:"
    echo "  $0 dev-start"
    echo "  $0 db-backup"
    echo "  $0 prod-start"
    echo "  POSTGRES_PASSWORD=secret $0 prod-start"
}

# Main command dispatcher
case "$1" in
    dev-start)
        dev_start
        ;;
    dev-stop)
        dev_stop
        ;;
    dev-restart)
        dev_restart
        ;;
    dev-logs)
        dev_logs
        ;;
    prod-start)
        prod_start
        ;;
    prod-stop)
        prod_stop
        ;;
    prod-logs)
        prod_logs
        ;;
    db-connect)
        db_connect
        ;;
    db-backup)
        db_backup
        ;;
    db-restore)
        db_restore "$2"
        ;;
    db-reset)
        db_reset
        ;;
    build)
        build
        ;;
    clean)
        clean
        ;;
    clean-all)
        clean_all
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac