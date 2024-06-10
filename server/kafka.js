const { Kafka } = require('kafkajs');
import Recepcion from './src/models/receptionModel';

import Broadcast from './src/classes/broadcast'

import ExtError from './src/classes/ExtError'
import Log from './src/classes/Log'
// Función para enviar un mensaje
async function sendMessage(event, data) {
    const broadcast = new Broadcast
    try {
        await broadcast.run(event, data);
    } catch (error) {
        console.error('Error durante el broadcast:', error);
    }
}

async function updateRecepcion(epc) {

    const consulta = {
        [`recepcionCajas.contenido.tags.${epc}`]: { $exists: true }
    };

    const actualizacion = {
        $set: {
            [`recepcionCajas.$[i].contenido.$[j].tags.${epc}.out`]: 1
        }
    };

    const options = {
        arrayFilters: [
            { [`i.contenido.tags.${epc}`]: { $exists: true } },
            { [`j.tags.${epc}`]: { $exists: true } }
        ]
    };

    // Ejecutar la actualización utilizando el método updateOne de MongoDB
    // try {
    // console.log(consulta)
    // console.log(actualizacion)
    // console.log(options)
    const res = await Recepcion.updateOne(consulta, actualizacion, options).exec();
    console.log('res', res)
    //return res
    // } catch (error) {
    //     throw new ExtError(error.message, 'actualizando-recepcion')
    // }
}

const arrayG = []
export async function kafkaConsumer() {
    // Callback personalizado para manejar errores
    // async function handleAsyncError(error) {
    //     try {
    //         // Lógica para manejar el error, como registrar en un archivo o enviar a un servicio
    //         console.log('Manejando error de forma asíncrona:', error.message);
    //         // Simular una operación asíncrona, como una espera de 1 segundo
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         console.log('Error manejado correctamente');
    //     } catch (err) {
    //         console.error('Error al manejar el error:', err);
    //     }
    // }
    // O puedes pasar un path personalizado, por ejemplo, new Log('/ruta/al/archivo.json')



    try {
        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: [process.env.KAFKA_BROKER]
        });


        const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUPID });

        await consumer.connect();
        await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

        console.log("Esperando mensajes...");
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                // // throw new Error('ell');
                const epc = JSON.parse(message.value.toString()).epc
                arrayG.push(epc);
                console.log(arrayG);
                await updateRecepcion(epc)
                try {
                    await sendMessage(process.env.SOCKET_EVENT_NAME, { epc: epc })
                } catch (error) {
                    
                }
            },
        });

        // Manejar errores
        // consumer.on('consumer.crash', ({ payload }) => {
        //     throw new ExtError('error.message', 'error-kafka')

        //     handleError(payload.error);
        // });
        // consumer.on('consumer.crash', (payload) => {
        //     const logger = new Log()
        //     logger.run({ evento: 'error.name', message: 'error.message', time: new Date() })

        // });

    } catch (error) {
        throw new ExtError(error.message, 'kafka-consumer')
    }
}
