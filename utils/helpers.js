const config = require('../config');

function isAdmin(username) {
  return config.adminUsernames.includes(username);
}

function isChatAllowed(chatId) {
  return config.allowedChatIds.length === 0 || config.allowedChatIds.includes(chatId);
}

module.exports = {
  isAdmin,
  isChatAllowed
};