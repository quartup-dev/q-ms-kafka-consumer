const fs = require("fs");
const path = require("path");

function createService(resource, rutaArchivo) {
  const serviceName = resource.toLowerCase() + 'Service';
  // const serviceName = resource.toLowerCase();
  resource = resource.charAt(0).toUpperCase() + resource.slice(1).toLowerCase();


  const fileName = `${serviceName}.js`;
  const filePath = path.join(rutaArchivo, fileName);

  const template = `// services/${serviceName}.js
  import ${resource}Repository from '../repositories/${resource.toLowerCase()}Repository';
  
  class ${resource}Service {
      async getCollection(req) {
          return await ${resource}Repository.findAll(req);
      }
  
      async findById(id) {
          return await ${resource}Repository.findById(id);
      }
      /**
       * 
       * @param {Object} body - Corresponde a req.body en una solicitud Express.
       * @returns 
       */
      async create(body) {
        return this.withTransaction(async (session) => {
          let actions = []
          let { resource, action } = await ${resource}Repository.create(body, session);
          //let { resource, action } = await ${resource}Repository.create(body);
          actions.push(action)

          return { resource, actions }

        })
      }
  
      async update(id, body) {
        return this.withTransaction(async (session) => {
          let actions = []
          let { resource, action } = await ${resource}Repository.update(id, body, session);
          //let { resource, action } = await ${resource}Repository.update(id, body);
          actions.push(action)

          return { resource, actions }

        })
      }
      async delete(id) {
        return this.withTransaction(async (session) => {
          let actions = []
          let { resource, action } = await ${resource}Repository.delete(id, session);
          //let { resource, action } = await ${resource}Repository.delete(id);
          actions.push(action)
          return { resource, actions }
        })
      }
  }
  export default new ${resource}Service();
  

    `;

  fs.writeFile(filePath, template, (err) => {
    if (err) {
      console.error("Error al crear el archivo de service:", err);
      return;
    }
    console.log(`Service ${fileName} creado en ${filePath}`);
  });
}

// const args = process.argv.slice(2); // Excluir los dos primeros argumentos: 'node' y el nombre del script
// if (args.length < 1) {
//   console.error("Uso: node create-service.js <resource> ");
//   process.exit(1);
// }

// const resource = args[0];

// Al final de create-service.js
module.exports = createService;

// createService(resource, "./server/src/services");

