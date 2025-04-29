require('dotenv').config();

module.exports = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/telegram_bot',
  port: process.env.PORT || 3000,
  adminUsernames: process.env.ADMIN_USERNAMES ? process.env.ADMIN_USERNAMES.split(',') : [],
  allowedChatIds: process.env.ALLOWED_CHAT_IDS ? process.env.ALLOWED_CHAT_IDS.split(',').map(id => parseInt(id.trim())) : []
};