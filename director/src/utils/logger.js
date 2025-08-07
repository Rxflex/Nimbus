import chalk from 'chalk';

const format = (type, color, message, ...args) => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `${timestamp} [${type}] ${message}`;
  console.log(chalk[color](formattedMessage), ...args);
}

const logger = {
  info: (message, ...args) => format('INFO', 'blue', message, ...args),
  error: (message, ...args) => format('ERROR', 'red', message, ...args),
  warn: (message, ...args) => format('WARN', 'yellow', message, ...args),
  debug: (message, ...args) => format('DEBUG', 'green', message, ...args),
  log: (message, ...args) => format('LOG', 'white', message, ...args)
}

export default logger;