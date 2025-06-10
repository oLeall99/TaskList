import Sequelize from "sequelize";
import databaseConfig from "../config/database.js"

import User from "../app/models/User";
import Task from "../app/models/Task";

const models = [User, Task];

class Database {
    constructor() {
        this.init();
    }

    init() {
        try {
            console.log('=== DATABASE INITIALIZATION ===');
            console.log('Environment:', process.env.NODE_ENV);
            console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
            console.log('Database config:', JSON.stringify(databaseConfig, null, 2));
            
            this.connection = new Sequelize(databaseConfig);
            
            console.log('Sequelize instance created');
            console.log('Initializing models...');
            
            models
            .map(model => {
                console.log(`Initializing model: ${model.name}`);
                return model.init(this.connection);
            })
            .map(model => {
                if (model.associate) {
                    console.log(`Setting up associations for: ${model.name}`);
                    return model.associate(this.connection.models);
                }
                return model;
            });
            
            console.log('Database initialization completed');
            
        } catch (error) {
            console.error('=== DATABASE INITIALIZATION ERROR ===');
            console.error('Error:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }
}

export default new Database();