const fs = require("fs");
const path = require("path");

function createModel(resource, rutaArchivo) {
  const modelName = resource.toLowerCase() + 'Model';
  // const modelName = resource.toLowerCase();
  resource = resource.charAt(0).toUpperCase() + resource.slice(1).toLowerCase();


  const fileName = `${modelName}.js`;
  const filePath = path.join(rutaArchivo, fileName);

  const template = `// models/${modelName}.js
  import mongoose from 'mongoose';

  const Schema = mongoose.Schema;
  
  const ${resource.toLowerCase()}Schema = new Schema({
  
    user_id: {
      type: String,
      required: true,
  
    },

    // tenant_id: { type: String },
  
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  
  // ${resource.toLowerCase()}Schema.index({ tenant_id: 1, deleted: 1 });
  
  ${resource.toLowerCase()}Schema.pre('findOneAndUpdate', function (next) {
    this._update.$set = {
      ...this._update.$set,
      updated_at: new Date(),
    };
    next();
  });
  
  const ${resource} = mongoose.model('${resource.toLowerCase()}', ${resource.toLowerCase()}Schema);
  
  export default ${resource};
  
    `;

  fs.writeFile(filePath, template, (err) => {
    if (err) {
      console.error("Error al crear el archivo de model:", err);
      return;
    }
    console.log(`Model ${fileName} creado en ${filePath}`);
  });
}

// const args = process.argv.slice(2); // Excluir los dos primeros argumentos: 'node' y el nombre del script
// if (args.length < 1) {
//   console.error("Uso: node create-model.js <resource> ");
//   process.exit(1);
// }

// const resource = args[0];
module.exports = createModel;

// createModel(resource, "./server/src/models");

