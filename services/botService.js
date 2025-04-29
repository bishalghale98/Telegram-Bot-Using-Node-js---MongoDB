const Data = require("../models/dataModel");
const logger = require("../utils/logger");
const { isAdmin } = require("../utils/helpers");

class BotService {
  constructor() {
    this.commands = {
      "/start": this.handleStart,
      "/help": this.handleHelp,
      "/listall": this.handleListAll,
      "/delete": this.handleDelete,
      "/add": this.handleAddOrUpdate, // Changed from 'add' to '/add'
    };
  }

  async processMessage(msg) {
    try {
      const { text, chat, from } = msg;
      const chatId = chat.id;
      const username = from.username || "unknown";

      logger.info(`📩 Received: [${username}] ${text}`);

      // Extract base command (handle cases like /add@botname)
      const baseCommand = text.split(" ")[0].split("@")[0].toLowerCase();

      // Handle known commands
      if (this.commands[baseCommand]) {
        return await this.commands[baseCommand].call(
          this,
          text,
          chatId,
          username
        );
      }

      // Default: search database
      return await this.handleSearch(text, chatId);
    } catch (error) {
      logger.error(`⚠️ Error processing message: ${error.stack}`);
      return "❌ An error occurred. Please try again later.";
    }
  }

  async handleStart() {
    return (
      `🤖 *Welcome to the Data Bot!*\n\n` +
      `You can:\n` +
      `- Search data by typing any name\n` +
      `- Add/update with \`/add name:value\`\n` +
      `- List all with \`/listall\` (admin)\n` +
      `- Get help with \`/help\``
    );
  }

  async handleHelp() {
    return (
      `🛠 *Available Commands:*\n\n` +
      `\`/start\` - Show welcome message\n` +
      `\`/help\` - Show this help\n` +
      `\`/add name:value\` - Add/update data\n` +
      `\`/listall\` - List all entries (admin)\n` +
      `\`/delete name\` - Delete entry (admin)`
    );
  }

  async handleSearch(text, chatId) {
    if (!text || text.startsWith("/")) {
      return "🔍 Please enter a name to search or use /help for commands";
    }

    try {
      const result = await Data.findOne({ name: text });
      return result
        ? `📋 ${text}:${result.value}`
        : `❌ "${text}" not found. Use \`/add ${text}:value\` to create it.`;
    } catch (error) {
      logger.error(`Search error: ${error.message}`);
      return "⚠️ Database error during search";
    }
  }

  async handleListAll(text, chatId, username) {
    if (!isAdmin(username)) {
      return "⛔ Admin access required.";
    }

    try {
      const allData = await Data.find({}).sort({ name: 1 });
      return allData.length > 0
        ? `📂 All Entries:\n${allData
            .map((d) => `• ${d.name}`)
            .join("\n")}`
        : "📭 Database is empty.";
    } catch (error) {
      logger.error(`ListAll error: ${error.message}`);
      return "⚠️ Failed to fetch data.";
    }
  }

  async handleDelete(text, chatId, username) {
    if (!isAdmin(username)) {
      return "⛔ Admin access required.";
    }

    const name = text.split(" ")[1] || text.split(":")[1];
    if (!name) {
      return "❌ Usage: /delete name\nExample: /delete test";
    }

    try {
      const result = await Data.findOneAndDelete({ name: name.trim() });
      return result ? `✅ Deleted: ${name}` : `❌ "${name}" not found`;
    } catch (error) {
      logger.error(`Delete error: ${error.message}`);
      return "⚠️ Failed to delete. Please try again.";
    }
  }

  async handleAddOrUpdate(text, chatId, username) {
    // Support both "/add name:value" and "/add:name:value" formats
    const content = text.replace(/^\/add[: ]?/, "").trim();
    const separator = content.includes(":") ? ":" : " ";
    const [name, ...valueParts] = content.split(separator);
    const value = valueParts.join(separator).trim();

    if (!name || !value) {
      return "❌ Invalid format. Use:\n`/add name:value`\nExample: `/add phone:123456789`";
    }

    try {
      const existing = await Data.findOne({ name });

      if (existing) {
        existing.value = value;
        existing.updatedAt = Date.now();
        await existing.save();
        logger.info(`Updated: ${name} by ${username}`);
        return `🔄 Updated: *${name}*\nNew value: ${value}`;
      } else {
        await Data.create({ name, value, createdBy: username });
        logger.info(`Added: ${name} by ${username}`);
        return `✅ Added: *${name}*\nValue: ${value}`;
      }
    } catch (error) {
      logger.error(`Add/Update error: ${error.message}`);
      return "⚠️ Failed to save. Name may be invalid or too long.";
    }
  }
}

module.exports = BotService;
