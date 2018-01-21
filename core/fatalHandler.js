'use strict';

const db        = require('./dbHandler');
const logger    = require('./logger');

module.exports = err => {
    logger.error(__filename, 'fatal error', err);
    db.close()
        .then(() => {
            logger.info(__filename, 'process exited with status 1');    
            process.exit(1);
        });
};