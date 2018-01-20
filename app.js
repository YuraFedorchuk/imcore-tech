"use strict";

const http  = require('http');

const URL   = require('url').URL;
const fs    = require('fs');
const ctrl  = require('./controllers');

const logger        = require('./core/logger');
const db            = require('./core/dbHandler');
const processFatal  = require('./core/fatalHandler');

const PORT = process.env.PORT || 3000;

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

const server = http.createServer((req, res) => {
    var { pathname, searchParams } = 
        new URL(`http://${req.headers.host}${req.url}`);

    if (req.method === 'POST') {
        res.statusCode = 500;
        res.end('POST is not supported. Use GET instead');
    }

    if (pathname === '/') {
        const rs = fs.createReadStream('./public/index.html'); 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        rs.pipe(res);    
    } else if (pathname === '/api/getPrices') {
        ctrl.getPrices()
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(data);
                res.end();
            })
            .catch(err => {
                res.statusCode = 500;
                res.end('Internal server error');
            });
    } else if (pathname === '/api/getPrice') {
        let name = searchParams.get('name');
        name = decodeURIComponent(name);

        if (!name) {
            res.statusCode = 400;
            res.end('Bad params');
        }

        ctrl.getPrice(name)
            .then(data => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(data);
                res.end();
            })
            .catch(err => {
                res.statusCode = 500;
                res.end('Internal server error');
            });
    } else {
        res.statusCode = 404;
        res.end('Page not Found');
    }
});


server.listen(PORT, () => {
    logger.info(__filename, `Server listening on ${PORT}`);
});

process.on('uncaughtException', err => {
    processFatal(err);
});


// ★ StatTrak™ Shadow Daggers | Urban Masked(Well - Worn)
// ★ StatTrak™ Huntsman Knife | Doppler(Minimal Wear)
// ★ StatTrak™ Huntsman Knife | Fade(Minimal Wear)