'use strict';

const db        = require('./../core/dbHandler');
const logger    = require('./../core/logger');

module.exports = err => {
    logger.error(__filename, 'fatal error', err);
    db.close();
    logger.info(__filename, 'process exited with status 1');    
    process.exit(1);
};