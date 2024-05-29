const fs = require("fs");
const path = require("path");

function createRepository(resource, rutaArchivo) {
    const repositoryName = resource.toLowerCase() + 'Repository';
    // const repositoryName = resource.toLowerCase();
    resource = resource.charAt(0).toUpperCase() + resource.slice(1).toLowerCase();


    const fileName = `${repositoryName}.js`;
    const filePath = path.join(rutaArchivo, fileName);

    const template = `// repositories/${repositoryName}.js
import ${resource} from '../models/${resource.toLowerCase()}Model';
import Repository from './Repository';

class ${resource}Repository extends Repository {
    constructor(model) {
        super(model);
    }
    async findAll(req) {
        const {
            itemsPerPage,
            page,
            skip,
            sort,
            permanentFilters,
            searchQuery
        } = this.processQuery(req)
        console.log(permanentFilters)
        const queryAggregation = [
            { $match: { $and: [permanentFilters, searchQuery] } },
            { $sort: sort },
            { $skip: skip },
            { $limit: itemsPerPage }
        ]

        const collection = await this.model.aggregate([
            ...queryAggregation,

        ]).exec();

        const totalRows = await this.getTotalRows(permanentFilters);
        const totalFilteredRows = await this.getTotalFilteredRows(permanentFilters, searchQuery);
        return {
            collection: collection,
            itemsPerPage: itemsPerPage,
            page: page,
            pages: Math.ceil(totalFilteredRows / itemsPerPage),
            totalFilteredRows: totalFilteredRows,
            totalRows: totalRows
        };
    }

    async findById(id) {
        const resource = await this.model.findById(id);
        if (!resource) {
            throw new Error('not found')
        }
        return resource
    }
    /**
     * 
     * @param {*} body - req.body de express
     * @param {*} session - Es la session de mongo para realizar transacciones
     * @returns 
     */
    async create(body, session = null) {
        const resource = new this.model(body);
        await resource.validate();
        await resource.save(session ? { session: session } : {});
        let action = this.getActionTransaction('create', '${resource.toLowerCase()}', resource);
        return { resource, action };
    }
    /**
     * 
     * @param {*} body - req.body de express
     * @param {*} session - Es la session de mongo para realizar transacciones
     * @returns 
     */
    async update(id, body, session = null) {
        const options = {
            new: true,
            runValidators: true,
            session: session
        };
        const resource = await this.model.findByIdAndUpdate(id, body, options);
        let action = this.getActionTransaction('update', '${resource.toLowerCase()}', resource);
        return {resource, action };
    }
    async delete(id, session = null) {//hard deletion
        const options = session ? { session } : {};
        const resource = await this.model.findByIdAndDelete(id, options);
        let action = this.getActionTransaction('delete', '${resource.toLowerCase()}', resource);
        return { resource, action };
    }


    /**
     *  
     * aggregations private functions
     * 
     */



    /**
     * Meta Crud Methods
     */
}

module.exports = new ${resource}Repository(${resource});

    `;

    fs.writeFile(filePath, template, (err) => {
        if (err) {
            console.error("Error al crear el archivo de repository:", err);
            return;
        }
        console.log(`Repository ${fileName} creado en ${filePath}`);
    });
}

// const args = process.argv.slice(2); // Excluir los dos primeros argumentos: 'node' y el nombre del script
// if (args.length < 1) {
//     console.error("Uso: node create-repository.js <resource> ");
//     process.exit(1);
// }

// const resource = args[0];


// createRepository(resource, "./server/src/repositories");
// Al final de create-repository.js
module.exports = createRepository;

