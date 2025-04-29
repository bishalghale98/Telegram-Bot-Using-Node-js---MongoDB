# Telegram Bot with MongoDB Integration

A MERN-compatible Telegram bot that connects to MongoDB for data storage and retrieval.

## Features

- Search MongoDB by name via Telegram messages
- Add/update data via Telegram commands
- REST API for data operations
- Admin controls for sensitive operations
- Comprehensive logging
- Docker support

## Prerequisites

- Node.js 18+
- MongoDB
- Telegram Bot Token from [BotFather](https://t.me/botfather)

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file based on `.env.example`
4. Start the application: `npm start`

## Docker Setup

1. Build and start containers: `docker-compose up -d`
2. Stop containers: `docker-compose down`

## Environment Variables

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_USERNAMES` - Comma-separated list of admin usernames
- `ALLOWED_CHAT_IDS` - Comma-separated list of allowed chat IDs (optional)

## Bot Commands

- `/start` - Welcome message
- `/help` - Show available commands
- `/listall` - List all entries (admin only)
- `/add:name:value` - Add or update an entry
- `/delete:name` - Delete an entry (admin only)

## API Endpoints

- `POST /api/data` - Add or update data
- `GET /api/data/:name` - Get data by name
- `GET /api/data` - Get all data (admin only)

## Testing

Run tests with: `npm test`

## Deployment

The application can be deployed to any Node.js hosting platform like:

- Heroku
- Render
- Railway
- AWS Elastic Beanstalk

For Docker deployments, use the provided Dockerfile and docker-compose.yml.
