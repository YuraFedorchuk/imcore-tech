'use strict';

const {isObject} = require('util');

const logger = {
    info: function (filename, message, obj) {
        if (process.env.NODE_ENV !== 'production') {
            let log = `\ninfo: message=${message} file=${filename} data=`;
            log += isObject(obj) ? JSON.stringify(obj) : obj;

            console.log(log);
        }
    },
    error: function (filename, message, err) {
        if (process.env.NODE_ENV !== 'production') {
            let log = `\nerror: message=${message} file=${filename} \
err_message=${err.message} err_stack=${err.stack}`;
            
            console.error(log);
        }
    }
}

module.exports = logger;