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


export async function kafkaConsumer() {

    try {
        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['88.198.208.224:9092']
        });

        const consumer = kafka.consumer({ groupId: 'Quartup-logistics-80' });

        await consumer.connect();
        await consumer.subscribe({ topic: 'Reader', fromBeginning: true });

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

                await updateRecepcion(epc)
                await sendMessage('logistics-consume-kafka', { epc: epc })
            },
        });


    } catch (error) {
        throw new ExtError(error.message, 'kafka-consumer')
    }
}
