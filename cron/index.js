'use strict';

const http                  = require('http');
const {isObject}            = require('util');
const uuid                  = require('node-uuid');
const squel                 = require('squel');
const BigNumber             = require('bignumber.js');

const {updateItems}     = require('./../api');
const config            = require('./../config').cron;
const db                = require('./../core/dbHandler');
const processFatal      = require('./../core/fatalHandler');
const logger            = require('./../core/logger');


const worker = {
    process: () => {
        worker.updateItems()
            .then(() => {
                logger.info(__filename,
                    'cron worker finished with status code 0');
                db.close(() => {
                    process.exit(0);
                });
            })
            .catch(processFatal);
    },
    updateItems: () => {
        return new Promise((resolve, reject) => {
            worker._getPrices()
                .then(res => {
                    try {
                        res = JSON.parse(res);
                    } catch(e) {
                        return reject(e);
                    }

                    if (!res || !res.items || !isObject(res.items)) {
                        throw new Error('Bad response from api');
                    }

                    let values = Object.values(res.items).map(e => {
                        return { 
                            name: e.name.replace(/'/g, '"'), 
                            safe_price: new BigNumber(e.safe_price)
                                .times(100).toFixed(0),  
                            safe_net_price: new BigNumber(e.safe_net_price)
                                .times(100).toFixed(0)
                        }
                    });
    
                    updateItems(values)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    },
    _getPrices: () => {
        return new Promise((resolve, reject) => {return resolve();
           const url = `${config.url}v2/pricelist?key=${config.apiKey}`;

            const reqId = uuid.v4();
    
            logger.info(__filename, 'getItems:request', {
                reqId: reqId,
                url: url
            });
    
            const req = http.request(url, (res) => {
                let data = '';
    
                logger.info(__filename, 'getItems:response', {
                    reqId: reqId,
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: JSON.stringify(res.headers)
                });

                if (res.statusCode !== 200) {
                    return reject(new Error(res.statusMessage));
                }
    
                res.setEncoding('utf-8');
                res.on('data', (chunk) => {
                    data += chunk;
                })
    
                res.on('end', () => {
                    logger.info(__filename, 'getItems:response:data', {
                        reqId: reqId,
                        response: data
                    });
    
                    if (!data || isObject(data)) {
                        return reject(new Error('Bad response'));
                    }
    
                    resolve(data);
                });
            });
    
            req.on('error', (e) => {
                return reject(e);
            });
    
            req.end();
        });
 
    }
};


module.exports = worker.process;