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
        // Configuração CORS para produção e desenvolvimento
        const corsOptions = {
            origin: function (origin, callback) {
                // Permitir requests sem origin (mobile apps, Postman, etc.)
                if (!origin) return callback(null, true);
                
                const allowedOrigins = [
                    'http://localhost:3000',
                    'http://localhost:3001',
                    'https://localhost:3000',
                    process.env.FRONTEND_URL, // URL do frontend em produção
                ];
                
                // Em desenvolvimento, permitir qualquer origin do localhost
                if (process.env.NODE_ENV !== 'production') {
                    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                        return callback(null, true);
                    }
                }
                
                if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error('Não permitido pelo CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };

        this.server.use(cors(corsOptions));
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