import { Router } from "express";

import authMiddleware from "./app/middlewares/auth";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import TaskController from "./app/controllers/TaskController";

const routes = new Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o status da API e conexão com banco de dados.
 *     tags:
 *       - Health Check
 *     responses:
 *       '200':
 *         description: API is running and database is connected.
 *       '500':
 *         description: Database connection error.
 */
routes.get('/health', async (req, res) => {
  try {
    const { Sequelize } = require('sequelize');
    const databaseConfig = require('./config/database.js');
    
    // Teste de conexão com o banco
    const sequelize = new Sequelize(databaseConfig);
    await sequelize.authenticate();
    await sequelize.close();
    
    return res.status(200).json({ 
      status: 'OK', 
      message: 'API is running and database is connected',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDB: !!process.env.DATABASE_URL
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDB: !!process.env.DATABASE_URL
    });
  }
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: user created successfully.
 *       '400':
 *         description: Erro in validation. / Email already in use.
 *       '501':
 *         description: Error creating user
 */
routes.post('/user', UserController.store);

/**
 * @swagger
 * /session:
 *   post:
 *     summary: Autentica um usuário e inicia uma sessão.
 *     tags:
 *       - Sessões
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Session created successfully.
 *       '400':
 *         description: invalid credentials.
 *       '501':
 *         description: Error creating session.
 */
routes.post('/session', SessionController.store);

// Autenticação de Token de Usuário para todas as rotas abaixo:
routes.use(authMiddleware);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Atualiza informações do usuário logado.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: user updated successfully.
 *       '400':
 *         description: Erro in validation. / Email already in use.
 *       '401':
 *         description: Incorrect Password. / User not find.
 *       '501':
 *         description: Error creating user
 */
routes.put('/user', UserController.update);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Busca os dados do usuário no banco de dados.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: user find.
 *       '401':
 *         description: User not find.
 *       '501':
 *         description: Error finding user
 */
routes.get('/user', UserController.find);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa para o usuário logado.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               desc:
 *                 type: string
 *     responses:
 *       '200':
 *         description: task created successfully.
 *       '400':
 *         description: Error in Validation.
 *       '500':
 *         description: Error creating task.
 */
routes.post('/tasks', TaskController.store);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas do usuário Logado.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of tasks. 
 *       '404':
 *         description: No tasks found.
 *       '500':
 *         description: Error finding tasks.
 */
routes.get('/tasks', TaskController.index);

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Busca uma única tarefa de acordo com o id.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: task_id
 *         required: true
 *         schema:
 *           type: integer
 *         in: query
 *     responses:
 *       '200':
 *         description: Task found. 
 *       '404':
 *         description: No task found.
 *       '500':
 *         description: Error finding task.
 */
routes.get('/task', TaskController.findOne);

/**
 * @swagger
 * /task/search:
 *   get:
 *     summary: Busca tarefas do usuário logado pelo título.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 3
 *         in: query
 *       - name: status
 *         in: query
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *             enum: [0, 1, 2]
 *       - name: time
 *         in: query
 *         required: true
 *     responses:
 *       '200':
 *         description: List of tasks. 
 *       '400':
 *         description: Error in Validation.
 *       '404':
 *         description: No tasks found.
 *       '500':
 *         description: Error finding tasks.
 */
routes.get('/tasks/search', TaskController.search);

/**
 * @swagger
 * /tasks/{task_id}:
 *   put:
 *     summary: Atualiza uma tarefa existente pelo ID.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: task_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: integer
 *               desc:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Task updated successfully.
 *       '400':
 *         description: Error in Validation.
 *       '404':
 *         description: Task not found.
 *       '500':
 *         description: Error updating task.
 */
routes.put('/tasks/:task_id', TaskController.update);

/**
 * @swagger
 * /tasks/{task_id}:
 *   delete:
 *     summary: Deleta uma tarefa existente pelo ID.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: task_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Task deleted successfully.
 *       '401':
 *         description: Invalid user.
 *       '404':
 *         description: Task not found.
 *       '500':
 *         description: Error deleting task.
 */
routes.delete('/tasks/:task_id', TaskController.delete);

export default routes;
