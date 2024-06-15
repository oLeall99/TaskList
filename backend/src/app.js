import express from "express";
import cors from 'cors';

// Rotas
import routes from './routes';

// Importe do database
import './database';

// Import do Swagger
import { swaggerDocs, swaggerUi } from './swagger';

class App{
    constructor(){
        this.server = express()

        this.middlewares();
        this.swagger();
        this.routes();

    }

    middlewares(){
        this.server.use(cors());
        this.server.use(express.json());
    }

    routes(){
        this.server.use(routes);
    }

    swagger() {
        this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }

}

export default new App().server; 