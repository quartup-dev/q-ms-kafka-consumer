import app from '../app';
import debugLib from 'debug';
import { kafkaConsumer } from '../kafka';
// import http from 'http';
const debug = debugLib('q-mss-test:server');
const port = normalizePort(process.env.APP_PORT || '4999');
import Log from '../src/classes/Log'

app.set('port', port);


const fs = require('fs');
const https = require('https');
// const port = 4999
// console.log(process.env.APP_PRIVKEY)
let oo = {
    key: fs.readFileSync(process.env.APP_PRIVKEY),
    cert: fs.readFileSync(process.env.APP_FULLCHAIN),
    requestCert: false,
    rejectUnauthorized: false
}

const server = https.createServer(oo, app);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('corriendo en puerto: ' + port)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    const logger = new Log();
    try {
        await kafkaConsumer()
    } catch (error) {
        console.error('Error -> ' + error.name + ":", error.message);
        logger.run({ evento: error.name, message: error.message, time: new Date() })
    }
    // .catch(error =>
}
