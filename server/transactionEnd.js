const uuid = require('uuid');

var fs = require('fs');
function transactionEnd(service) {
    return async function (req, res, next) {
        if (res.controlled !== true) {
            console.log('getLoca-->', res.controlled)
            console.log('getLoca-->', typeof res.controlled)
            console.log('no controlado')
            return next()
        }
        if (req.transaction.method === 'GET') {
            if (res.locals.data && typeof res.locals.data.status === 'number') {
                return res.status(res.locals.data.status).json(res.locals.data);
            } else {
                // Manejar el caso donde res.locals.data no está definido o no tiene un status válido
                console.log({ no: 'data' })
                return res.status(200).json({ no: "data" });
            }
            // return res.status(res.locals.data.status).json(res.locals.data);
        }
        req.transaction.response = res.locals.data
        // res.locals.data.mas = "data"
        // Enviar los datos en la respuesta
        const responseTimestamp = new Date();
        req.transaction.response_time = responseTimestamp - req.transaction.timestamp;
        // console.log('Tiempo de respuesta:', req.transaction.responseTime, 'ms');
        // console.log('finalmente', req.transaction)
        // console.log('fin')

        //----- hacemos un envio post al micro--------
        var clientServerOptions = {
            uri: process.env.STORE_TRANSACTION,
            body: JSON.stringify(req.transaction),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: req.headers.authorization
            }
        }
        var request = require('request-promise');
        try {
            //console.log("try");
            throw new Error('provoco un error ultimo error')
            await request(clientServerOptions);


        } catch (error) {
            //console.log("catch")
            // throw new Error(error.message)
            //si falla la insercion en base de datos lo metemos en archivo
            const content = fs.readFileSync('transactions.json', 'utf-8');
            // console.log('===>', content);
            let t = []
            try {
                t = JSON.parse(content)
            } catch (error) {
                t = []
            }
            t.push(req.transaction)
            fs.writeFile('transactions.json', JSON.stringify(t, null, 2) + '\n', (err) => {
                if (err) throw err;
                console.log('Transacción guardada en archivo JSON.');
            });
        }
        //--------------


        return res.status(res.locals.data.status).json(res.locals.data);
    }
}

module.exports = transactionEnd;
