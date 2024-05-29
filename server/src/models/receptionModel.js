import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const contenidoSchema = new Schema({
    //estructura de cada objeto dentro de contenido
    tags: {
        type: Map, of: new Schema({
            OUT: { type: Number }
        }, { _id: false })
    }
}, { _id: false });
const recepcionCajaSchema = new Schema({
    caja: { type: String },
    sec: { type: [Number] }, // Supongo que 'sec' es un array de números
    contenido: [contenidoSchema],
    recepcionado: { type: Number }
}, {
    timestamps: true, // Esto añade automáticamente los campos created_at y updated_at
    strict: true,
});

const recepcionSchema = new Schema({

    origen: { type: String },
    destino: { type: String },
    destino_final: { type: String },
    recepcion: { type: String },
    amp_delivery_ext: { type: Number },
    recepcion_fecha: { type: Date },
    json_raw: { type: Schema.Types.Mixed }, // Se utiliza Mixed para admitir cualquier tipo de estructura JSON
    mas_datos: { type: Schema.Types.Mixed },
    cajas_teoricas: { type: Number },
    cajas_reales: { type: Number },
    updated_at: { type: Date },
    created_at: { type: Date },
    recepcionCajas: [recepcionCajaSchema],
    bionix: { type: Schema.Types.Mixed }, // Null se maneja con Mixed
    status: { type: String },
    total_recepcionado: { type: Number },
    total_teorico: { type: Number },
    resumen: [{ type: Schema.Types.Mixed }], // Se utiliza Mixed para admitir cualquier tipo de estructura JSON en la lista de objetos
    qa: { type: Schema.Types.Mixed },


}, {

    timestamps: true, // Esto añade automáticamente los campos created_at y updated_at

    strict: true,
});


const Recepcion = mongoose.model('recepcion', recepcionSchema, 'recepciones');

export default Recepcion;
