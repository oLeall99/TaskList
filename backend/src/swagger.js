import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Task List API Documentação',
      version: '1.0.0',
      description: 'Documentação da API construída em nodeJs e Express de um serviço de Task List, no qual o usuário pode salvar tarefas e afazeres em um banco de dados relacional postgresSQL',
      contact: {
        name: 'Arthur Leal Mussio',
        email: 'art5mussi@outlook.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3333', // URL do seu servidor
      },
    ],
  },
  apis: ['./src/routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
