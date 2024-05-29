const { Kafka } = require('kafkajs');
import Recepcion from './src/models/receptionModel';

async function updateRecepcion(epc) {

    const consulta = {
        [`recepcionCajas.contenido.tags.${epc}`]: { $exists: true }
    };

    const actualizacion = {
        $set: {
            [`recepcionCajas.$[i].contenido.$[j].tags.${epc}.OUT`]: 1
        }
    };

    const options = {
        arrayFilters: [
            { [`i.contenido.tags.${epc}`]: { $exists: true } },
            { [`j.tags.${epc}`]: { $exists: true } }
        ]
    };

    // Ejecutar la actualización utilizando el método updateOne de MongoDB
    try {
        const res = await Recepcion.updateOne(consulta, actualizacion, options);
        console.log('llamamos con -> ', epc)
        return res
    } catch (error) {
        console.log('rror -> ', error.message)
    }

}

export async function kafkaConsumer() {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['88.198.208.224:9092']
    });

    const consumer = kafka.consumer({ groupId: 'Quartup-logistics-9' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'Reader', fromBeginning: true });

    console.log("Esperando mensajes...");

    try {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                const epc = JSON.parse(message.value.toString()).value.epc
                updateRecepcion(epc)
                // Aquí puedes procesar cada mensaje como desees
            },
        });
    } catch (error) {
        console.error("Error al consumir mensajes:", error);
    }
}

// consumeMessages();
