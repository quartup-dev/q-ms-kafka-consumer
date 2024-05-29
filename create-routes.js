const fs = require("fs");
const path = require("path");


function createRoutes(resource, rutaArchivo) {
  const controllerName = resource.toLowerCase() + 'Controller';


  resource = resource.charAt(0).toUpperCase() + resource.slice(1).toLowerCase();


  const fileName = `${resource.toLowerCase()}.js`;
  const filePath = path.join(rutaArchivo, fileName);

  const template = `
    const express = require('express');
    const router = express.Router();

    import ${controllerName} from "../controllers/${controllerName}"

    router.get('/', ${controllerName}.index)
    router.post('/', ${controllerName}.store)
    router.get('/:id', ${controllerName}.show)
    router.put('/:id', ${controllerName}.update)
    router.delete('/:id', ${controllerName}.delete)

    module.exports = router;
    `;

  fs.writeFile(filePath, template, (err) => {
    if (err) {
      console.error("Error al crear el archivo de controlador:", err);
      return;
    }
    console.log(`route ${fileName} creado en ${filePath}`);
  });

  const routesPath = './routes.json';

// Leer el archivo
let data = fs.readFileSync(routesPath, 'utf8');

// Parsear el contenido del archivo a un array de objetos
let routes = JSON.parse(data);
let route = {
  "path": "/api/helpdesk/" + resource.toLowerCase(),
  "module": "./src/routes/" + resource.toLowerCase()
}
routes.push(route)
fs.writeFile(routesPath, JSON.stringify(routes, null, 2) + '\n', (err) => {
  if (err) throw err;
  console.log('Success. Rutas guardadas.');
});

}


// const args = process.argv.slice(2); // Excluir los dos primeros argumentos: 'node' y el nombre del script
// if (args.length < 1) {
//   console.error("Uso: node create-routes.js <resource> ");
//   process.exit(1);
// }

// const resource = args[0];
module.exports = createRoutes;



// createRoutes(resource, "./server/src/routes");

//....
// const routesPath = './routes.json';

// // Leer el archivo
// let data = fs.readFileSync(routesPath, 'utf8');

// // Parsear el contenido del archivo a un array de objetos
// let routes = JSON.parse(data);
// let route = {
//   "path": "/api/helpdesk/" + resource.toLowerCase(),
//   "module": "./src/routes/" + resource.toLowerCase()
// }
// routes.push(route)
// fs.writeFile(routesPath, JSON.stringify(routes, null, 2) + '\n', (err) => {
//   if (err) throw err;
//   console.log('Success. Rutas guardadas.');
// });
