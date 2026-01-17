const cron = require('node-cron');
const OrderCancellationService = require('../services/orderCancellationService');

/**
 * Initialize and start the order cancellation cron job
 * @param {Object} db - Database pool instance
 * @param {Object} logger - Logger instance
 */
function initializeOrderCancellationJob(db, logger) {
  try {
    // Create instance of OrderCancellationService
    const orderCancellationService = new OrderCancellationService(db, logger);

    // Set up cron schedule to run every 15 minutes
    const cronSchedule = '*/15 * * * *';
    
    logger.info('Initializing order cancellation cron job', {
      schedule: cronSchedule,
      description: 'Runs every 15 minutes'
    });

    cron.schedule(cronSchedule, async () => {
      const startTime = Date.now();
      
      logger.info('Order cancellation cron job started', {
        timestamp: new Date().toISOString()
      });

      try {
        // Call cancelExpiredOrders and log results
        const summary = await orderCancellationService.cancelExpiredOrders();
        
        const executionTime = Date.now() - startTime;
        
        logger.info('Order cancellation cron job completed', {
          timestamp: new Date().toISOString(),
          executionTime: `${executionTime}ms`,
          processedCount: summary.processedCount,
          successCount: summary.successCount,
          failureCount: summary.failureCount,
          errors: summary.errors
        });

        if (summary.failureCount > 0) {
          logger.warn('Some orders failed to cancel', {
            failureCount: summary.failureCount,
            errors: summary.errors
          });
        }
      } catch (error) {
        logger.error('Error during cron job execution', {
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack
        });
      }
    });

    logger.info('Order cancellation cron job initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize order cancellation cron job', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

module.exports = { initializeOrderCancellationJob };
