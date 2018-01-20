'use strict';

const mysql = require('mysql');
const config = require('./../config').db;
const logger = require('./../core/logger');
const processFatal = require('./../core/fatalHandler');

var dbHandler = {
    pool: null,
    init: () => {
        if (dbHandler.pool) {
            return dbHandler;
        } else {
            const pool = mysql.createPool({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                multipleStatements: true
            });

            dbHandler.pool = pool;

            pool.on('connection', () => {
                logger.info(__filename, 'db connection established');
            });

            pool.on('release', () => {
                logger.info(__filename, 'db connection released');
            });
 
            logger.info(__filename, 'db initialization completed');

            return dbHandler;
        }
    },
    query: function(query) {
        return new Promise((resolve, reject) => {
            logger.info(__dirname, 'db query', {
                query: query
            });
            
            dbHandler.pool.query(query, (err, result, fields) => {            
                if (err) 
                    return reject(err);

                resolve(result);
            });
        });
    },
    close: function() {
        if (dbHandler.pool) {
            dbHandler.pool.end(err => {
                if (err) 
                    logger.error(__filename, 'failed to close db pool', err);

                logger.info(__filename, 'db pool closed');
            });
        }
    }
}



module.exports = dbHandler.init();