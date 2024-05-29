const fs = require("fs");
const path = require("path");

function createController(resource, rutaArchivo) {
  const controllerName = resource.toLowerCase() + 'Controller';
  const repositoryName = resource.toLowerCase() + 'Service';
  resource = resource.charAt(0).toUpperCase() + resource.slice(1).toLowerCase();


  const fileName = `${controllerName}.js`;
  const filePath = path.join(rutaArchivo, fileName);

  const template = `
import ${resource}Service from '../services/${repositoryName}';
import Controller from './Controller';

class ${resource}Controller extends Controller {
  index = async (req, res, next) => {
    try {
      const collection = await ${resource}Service.getCollection(req);
      this.successResponse(res, next, collection)
    } catch (error) {
      this.errorResponse(res, next, error)
    }
  }
  show = async (req, res, next) => {
    try {
      const id = req.params.id
      const resource = await ${resource}Service.findById(id);
      this.successResponse(res, next, resource)
    } catch (error) {
      this.errorResponse(res, next, error)
    }
  }
  store = async (req, res, next) => {
    try {
      let { resource, actions } = await ${resource}Service.create(req.body);
      req.transaction.actions = actions
      this.successResponse(res, next, resource)
    } catch (error) {
      this.errorResponse(res, next, error)
    }
  }
  update = async (req, res, next) => {
    try {
      const id = req.params.id
      const { resource, actions } = await ${resource}Service.update(id, req.body);
      req.transaction.actions = actions
      req.transaction.payload.params = req.params;
      this.successResponse(res, next, resource)
    } catch (error) {
      this.errorResponse(res, next, error)
    }
  }
  delete = async (req, res, next) => {
    try {
      const id = req.params.id
      const { resource, actions } = await ${resource}Service.update(id, { deleted: true });
      req.transaction.actions = actions
      req.transaction.payload.params = req.params;
      this.successResponse(res, next, resource)
    } catch (error) {
      this.errorResponse(res, next, error)
    }
  }
}

export default new ${resource}Controller()
    `;

  fs.writeFile(filePath, template, (err) => {
    if (err) {
      console.error("Error al crear el archivo de controlador:", err);
      return;
    }
    console.log(`Controlador ${fileName} creado en ${filePath}`);
  });
}



// const args = process.argv.slice(2); // Excluir los dos primeros argumentos: 'node' y el nombre del script
// if (args.length < 1) {
//   console.error("Uso: node create-controller.js <resource> ");
//   process.exit(1);
// }

// const resource = args[0];
module.exports = createController;




