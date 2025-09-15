// Simple logging utility
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}\n`;
  }

  writeToFile(filename, message) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, message);
  }

  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('info', message, meta);
    console.log(formattedMessage.trim());
    this.writeToFile('app.log', formattedMessage);
  }

  error(message, meta = {}) {
    const formattedMessage = this.formatMessage('error', message, meta);
    console.error(formattedMessage.trim());
    this.writeToFile('error.log', formattedMessage);
  }

  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('warn', message, meta);
    console.warn(formattedMessage.trim());
    this.writeToFile('app.log', formattedMessage);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, meta);
      console.debug(formattedMessage.trim());
      this.writeToFile('debug.log', formattedMessage);
    }
  }
}

module.exports = new Logger();