// service/Service.js

class Service {
    constructor() {

    }
    async withTransaction(operation) {
        const mongoose = require('mongoose');
        const session = await mongoose.startSession();
        let result;
        
        try {
            session.startTransaction();
            result = await operation(session);
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
        
        return result;
    }

}

module.exports = Service;
