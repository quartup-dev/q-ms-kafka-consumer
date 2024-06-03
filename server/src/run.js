
const Log = require('./classes/Log')
const logger = new Log()
const contenido = ` [
        {

          "tags": {
            "Quartup001": {
              "in": 1,
              "out": 0
            },
            "Quartup002": {
              "in": 1,
              "out": 0
            },
            "Quartup003": {
              "in": 1,
              "out": 0
            },
            "Quartup004": {
              "in": 1,
              "out": 0
            },
            "Quartup005": {
              "in": 1,
              "out": 0
            },
            "Quartup006": {
              "in": 1,
              "out": 0
            },
            "Quartup007": {
              "in": 1,
              "out": 0
            },
            "Quartup008": {
              "in": 1,
              "out": 0
            },
            "Quartup009": {
              "in": 1,
              "out": 0
            },
            "Quartup010": {
              "in": 1,
              "out": 0
            }
          }
        }
     
  ]`

function getQkey(n) {
    return "Quartup" + String(n).padStart(4, '0');
}
function generaObjetoIn(i, f) {
    let o = {}
    for (let j = i; j < f + 1; j++) {
        o[getQkey(j)] = {
            "in": 1,
            "out": 0
        }
    }
    return o
}

function generarContenidoAdicional(cantidad) {
    // Convertir el contenido a un objeto JavaScript
    let c = []
    for (let j = 0; j < cantidad; j++) {
        let kk = (j + 1) * 10
        c.push({ contenido: [{ tags: generaObjetoIn(kk - 9, kk) }] })
    }
    return c


}

// Llamar a la función con la cantidad de objetos adicionales que deseas generar
const nuevoContenido = generarContenidoAdicional(100);
// console.log(nuevoContenido)
// console.log(nuevoContenido)
logger.run(nuevoContenido)