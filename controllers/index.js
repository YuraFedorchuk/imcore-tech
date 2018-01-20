var { getPrice, getPrices } = require('./../api');

module.exports = {
    getPrices: function() {
        return new Promise((resolve, reject) => {
            getPrices()
                .then(res => {
                    if (!res) {
                        return reject(new Error('Empty response from db'));
                    }

                    resolve(JSON.stringify(res));
                })
                .catch(reject);
        });
    },
    getPrice: function(name) {
        return new Promise((resolve, reject) => {
            if (!name) {
                return reject(new Error('Bad parametes passed in request'));
            }
            
            getPrice(name)
                .then(res => {
                    if (!res) {
                        return reject(new Error('Empty response from db'));
                    }

                    resolve(JSON.stringify(res));
                })
                .catch(reject);
        });
    }
};