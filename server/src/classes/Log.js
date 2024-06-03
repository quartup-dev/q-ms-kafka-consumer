// Log.js
const fs = require('fs');
const path = require('path');

class Log {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, '../../', 'error-log.json');
    }

    async run(data) {
        try {
            // Leer el contenido actual del archivo
            let fileContent = [];
            if (fs.existsSync(this.filePath)) {
                const rawData = fs.readFileSync(this.filePath);
                fileContent = JSON.parse(rawData);
            }

            // Agregar el nuevo registro
            fileContent.push(data);

            // Escribir de nuevo el archivo
            fs.writeFileSync(this.filePath, JSON.stringify(fileContent, null, 2));
            // console.log(this.filePath)
            // console.log('Registro añadido con éxito');
        } catch (error) {
            console.error('Error al escribir en el archivo:', error);
        }
    }
}

module.exports = Log;
