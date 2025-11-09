# Docker Setup for p5x

This project includes Docker Compose configuration for running PostgreSQL locally.

## Quick Start

1. **Start the database:**
   ```bash
   docker-compose up -d
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Optional - View data with Prisma Studio:**
   ```bash
   npx prisma studio
   ```

## Docker Commands

- **Start services:** `docker-compose up -d`
- **Stop services:** `docker-compose down`
- **View logs:** `docker-compose logs postgres`
- **Remove volumes (reset database):** `docker-compose down -v`

## Database Configuration

- **Database:** p5x_db
- **User:** p5x_user
- **Password:** p5x_password
- **Port:** 5432
- **Connection URL:** `postgresql://p5x_user:p5x_password@localhost:5432/p5x_db`

## Troubleshooting

- If port 5432 is already in use, change the port mapping in `docker-compose.yml`
- Make sure Docker is running before executing commands
- Use `docker-compose logs postgres` to check database logs