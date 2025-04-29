const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const BotService = require('../services/botService');
const logger = require('../utils/logger');

class BotController {
  constructor() {
    this.bot = new TelegramBot(config.telegramBotToken, { polling: true });
    this.botService = new BotService();
    this.setupListeners();
  }

  setupListeners() {
    this.bot.on('message', async (msg) => {
      try {
        const response = await this.botService.processMessage(msg);
        this.bot.sendMessage(msg.chat.id, response);
      } catch (error) {
        logger.error(`Error in bot listener: ${error.message}`);
        this.bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
      }
    });

    this.bot.on('polling_error', (error) => {
      logger.error(`Polling error: ${error.message}`);
    });

    logger.info('Telegram bot is running and listening for messages...');
  }
}

module.exports = BotController;