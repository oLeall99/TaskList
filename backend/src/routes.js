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
 *       '201':
 *         description: Usuário criado com sucesso.
 *       '400':
 *         description: Falha na Validação ou Email já em uso.
 */
routes.post('/user', UserController.store);

/**
 * @swagger
 * /sessions:
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
 *         description: Sessão iniciada com sucesso.
 *       '400':
 *         description: Credenciais inválidas.
 */
routes.post('/sessions', SessionController.store);

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
 *         description: Informações do usuário atualizadas com sucesso.
 *       '400':
 *         description: Falha na Validação ou Email já em uso.
 *       '401':
 *         description: Senha Incorreta.
 */
routes.put('/user', UserController.update);

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
 *         description: Tarefa criada com sucesso.
 *       '400':
 *         description: Falha na Validação.
 *       '500':
 *         description: Erro ao criar Tarefa.
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
 *         description: Lista de tarefas.  
 *       '404':
 *         description: Nenhuma tarefa encontrada.
 *       '500':
 *         description: Erro ao buscar Tarefas.
 */
routes.get('/tasks', TaskController.index);

/**
 * @swagger
 * /tasks/search:
 *   get:
 *     summary: Busca tarefas do usuário logado pelo título.
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de tarefas recuperada com sucesso.
 *       '400':
 *         description: Falha na Validação.
 *       '404':
 *         description: Nenhuma tarefa encontrada.
 *       '500':
 *         description: Erro ao buscar Tarefa(s).
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
 *         description: Tarefa atualizada com sucesso.
 *       '400':
 *         description: Falha na Validação ou Tarefa não existe.
 *       '500':
 *         description: Erro ao atualizar Tarefa.
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
 *         description: Tarefa deletada com sucesso.
 *       '400':
 *         description: Tarefa não existe ou usuário inválido.
 *       '500':
 *         description: Erro ao deletar Tarefa.
 */
routes.delete('/tasks/:task_id', TaskController.delete);

export default routes;
