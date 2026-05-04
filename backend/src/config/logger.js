import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve project root (backend/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const logFormat = winston.format.printf(({ timestamp, level, clerkId, action, status, message }) => {
  const parts = [
    `[${timestamp}]`,
    `[${level.toUpperCase()}]`,
    clerkId ? `[ClerkID: ${clerkId}]` : '[ClerkID: N/A]',
    action ? `[Action: ${action}]` : '',
    status ? `[Status: ${status}]` : '',
    message
  ];
  return parts.filter(Boolean).join(' ');
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Write all activity to activity.log at project root
    new winston.transports.File({
      filename: path.join(projectRoot, 'activity.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Also log to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    })
  ]
});

/**
 * Log an activity with structured metadata.
 * @param {'info'|'warn'|'error'} level - Log level
 * @param {Object} meta - Structured log metadata
 * @param {string} [meta.clerkId] - Clerk user ID
 * @param {string} meta.action - Action performed (e.g. 'user.created', 'transaction.gain')
 * @param {string} meta.status - Status (e.g. 'success', 'failed', 'denied')
 * @param {string} [meta.message] - Additional details
 */
export function logActivity(level, { clerkId, action, status, message = '' }) {
  logger.log(level, message, { clerkId, action, status });
}

export default logger;
