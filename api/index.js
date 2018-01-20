'use strict';

const squel = require('squel');
const db = require('./../core/dbHandler');

module.exports = {
    getPrices: function() {
        return new Promise((resolve, reject) => {
            var q = squel.select()
                .field('name').field('safe_price').field('safe_net_price')
                .from('items')
                .toString();
                
            db.query(q)
                .then(resolve)
                .catch(reject);
        });
    },
    getPrice: function(name) {
        return new Promise((resolve, reject) => {
            var q = squel.select()
                .field('safe_price').field('safe_net_price')
                .from('items')
                .where('name = ?', name)
                .toString();

            db.query(q)
                .then(resolve)
                .catch(reject);
        });
    },
    updateItems: function(values) {
        return new Promise((resolve, reject) => {
            /**
             * !! Not the best way to update tables in production 
             */
            let q = 'TRUNCATE TABLE `items`; '
            q += squel.insert({
                autoQuoteFieldNames: true,
                autoQuoteTableNames: true
            })
            .into('items')
            .setFieldsRows(values)
            .toString();

            db.query(q)
                .then(resolve)
                .catch(reject);
        });
    }
};