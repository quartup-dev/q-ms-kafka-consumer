global.__basedir = __dirname;

import express from 'express';
import cookieParser from 'cookie-parser';
import transactionStartMiddleware from './transactionStart.js'; // Asegúrate de ajustar esta ruta al lugar donde hayas guardado tu archivo transaction.js
import transactionEndMiddleware from './transactionEnd.js';
import path from 'path';
import { } from 'dotenv/config' // con esto tenemos process.env
//______________conexion base de datos_______
require('./conn-mongo');
//____________________________________________
const morgan = require('morgan');
var helmet = require('helmet');
const cors = require('cors');
var app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(helmet());
// app.use(logger('dev'));
app.use(morgan('tiny'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// --
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// --
app.use(cookieParser());
//--test


app.get('/', async (req, res) => {

    return res.json({ ":": ')' });
});
//--
// routes att antes de empezar transaccion pues estar rutas dan su res



app.use(transactionStartMiddleware('helpdesk'));
/**
 * Bloque rutas
 */
const routesPath = path.resolve(global.__basedir, '../routes.json');
const fs = require('fs');
// Leer el archivo
let data = fs.readFileSync(routesPath, 'utf8');
// Parsear el contenido del archivo a un array de objetos
let routes = JSON.parse(data);
routes.forEach(route => {
    app.use(route.path, require(route.module));
});

/**
 * Bloque rutas fin
 */
// Middleware post-controlador
app.use(transactionEndMiddleware())//aqui hacemos finalmente return res. ...



// {
//   "path": "/api/helpdesk/attachment",
//   "module": "./src/routes/attachment"
// },
//_____________consumiendo rabbit mq-------------------
//____________ERRORES______________
function logErrors(err, req, res, next) {
    // console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(501).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(503);
    console.log(err.message)
    res.json({ error: err });
}
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(function (req, res, next) {
    res.status(404).json({ error: 'Sorry cant find that, in helpdesk!, ops' });
});

export default app;