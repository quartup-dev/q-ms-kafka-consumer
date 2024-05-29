const createService = require('./create-service');
const createRepository = require('./create-repository');
const createController = require('./create-controller')
const createModel = require('./create-model')
const createRoutes = require('./create-routes')

const args = process.argv.slice(2); // Excluir 'node' y 'create-entity.js'
if (args.length < 1) {
  console.error("Uso: node create-entity.js <resource>");
  process.exit(1);
}

const resource = args[0];
const servicePath = "./server/src/services";
const repositoryPath = "./server/src/repositories";
const controllerPath = "./server/src/controllers";
const modelPath = "./server/src/models";
const routesPath = "./server/src/routes";

// Ejecutar ambas funciones
createService(resource, servicePath);
createRepository(resource, repositoryPath);
createController(resource, controllerPath);
createModel(resource, modelPath);
createRoutes(resource, routesPath);

