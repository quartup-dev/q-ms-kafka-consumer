const uuid = require('uuid');
const jwt = require('jsonwebtoken');
var fs = require('fs');
function transactionStart(service) {
    return function (req, res, next) {
        let transaction = {
            service: service,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date(),
            host: req.headers.host,
            origin: req.headers.origin,
            referer: req.headers.referer,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            ips: req.ips,
            user_id: null,
            user_name: null,
            actions: [],
            payload: {
                body: JSON.parse(JSON.stringify(req.body)),
                query: req.query,
                // params: req.params //se añade en repositorio en metodos update y delete
            },
            request_id: uuid.v4()
        };
        let token = req.headers.authorization
        // console.log('el token qué token' ,token)
        if (typeof token === 'undefined') {
            req.transaction = transaction
            return next()
        }
        var publicKey = fs.readFileSync('public.key');
        const bearer = token.split(" ");
        token = bearer[1].trim();
        // console.log('pasa w')
        try {
            var ver = jwt.verify(token, publicKey, { algorithm: 'RS256' });
            // console.log(ver.data)
            transaction.user_id = ver.data._id
            transaction.user_name = ver.data.name
            req.transaction = transaction
            next();
        } catch (error) {
            console.log(error.message, ' entra en error')
            req.transaction = transaction
            next()
        }
    }
}

module.exports = transactionStart;
