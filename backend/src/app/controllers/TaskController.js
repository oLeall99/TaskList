import * as Yup from 'yup';
import { Op } from 'sequelize';

import Task from "../models/Task";


class TaskController{
    async store(req, res){
        try {
            // Schema de Validação do body:
            const schema = Yup.object().shape({
                title: Yup.string().required().min(3),
                desc: Yup.string().required(),
            });

            // Verificação se os dados foram enviados corretamente:
            if(!(await schema.isValid(req.body))){
                return res.status(400).json({erro: "Error in Validation."});
            }

            // Busca os dados da tarefa no body:
            const { title, desc } = req.body;       
            
            // Cria a Tarefa:
            const task = await Task.create({
                user_id: req.userId,
                title,
                desc,
            });     

            return res.status(200).json(task)

        }catch(err){
            console.error(err);
            return res.status(501).json({ description: "Error creating task"});
        }
    }

    async index(req, res){
        try{

            // Busca todas as Tasks do usuário:
            const tasks = await Task.findAll({
                where: {user_id: req.userId },
                order: [['status', 'ASC']] // Ordena as tarefas pelo status em ordem crescente
            })
            
            // Verifica se a lista de tarefas está vazia:
            if (tasks.length === 0) {
                return res.status(404).json({ message: 'No tasks found.' });
            }
            
            return res.json(tasks);

        }catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Error finding tasks.' });
        }
    }

    async findOne(req, res){
        try{
            const { task_id } = req.query;
            const task = await Task.findByPk(task_id);

            if(!task){
                return res.status(404).json({erro: "Task not found."});
            }

            return res.status(200).json(task);
        }catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Error updating task.' });
        }
    }

    async search(req, res) {
        try {
            // Esquema de validação usando Yup
            const schema = Yup.object().shape({
                search: Yup.string(),
                pendente: Yup.boolean().required(),
                emAndamento: Yup.boolean().required(),
                concluido: Yup.boolean().required(),
                time: Yup.string().oneOf(['new', 'old']).required(),
            });
    
            // Verificação se os dados do usuário foram enviados corretamente:
            if (!(await schema.isValid(req.query))) {
                return res.status(400).json({ error: 'Error in Validation.' });
            }
    
            const { search = '', pendente, emAndamento, concluido, time } = req.query;

            // Converte strings 'true' e 'false' para booleanos
            const pendenteBool = pendente === 'true';
            const emAndamentoBool = emAndamento === 'true';
            const concluidoBool = concluido === 'true';

            // Monta array de status baseado nos parâmetros recebidos
            const statusArray = [];
            if (pendenteBool) statusArray.push(0); 
            if (emAndamentoBool) statusArray.push(1);
            if (concluidoBool) statusArray.push(2);
            
            if(statusArray.length <= 0){
                return res.status(400).json({ error: 'Error in Validation.' });
            }

            // Define a condição de busca para o título
            const titleCondition = search ? { [Op.like]: `%${search}%` } : { [Op.ne]: null };

            // Define a condição de busca pelo time
            const order = [['createdAt', time === 'new' ? 'DESC' : 'ASC']];
    
            // Busca todas as Tasks do usuário que atendam as condições
            const tasks = await Task.findAll({
                where: {
                    user_id: req.userId,
                    title: titleCondition,
                    status: { [Op.in]: statusArray }
                },
                order: order
            });
    
            // Verifica se a lista de tarefas está vazia:
            if (tasks.length === 0) {
                return res.status(404).json({ message: 'No tasks found.' });
            }
    
            return res.status(200).json(tasks);
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error finding tasks.' });
        }
    }

    async update(req, res){
        try{
            // Verificação se os dados foram enviados corretamente:
            const schema = Yup.object().shape({
                title: Yup.string().notRequired(),
                desc: Yup.string().notRequired(),
                status: Yup.number().notRequired(),
            });
            
            // Verificação se os dados do usuário foram enviados corretamente:
            if(!(await schema.isValid(req.body))){
                return res.status(400).json({erro: "Error in Validation."});
            }
            
            // Busca pelo Id da Tarefa
            const { task_id } = req.params;
            const task = await Task.findByPk(task_id);
            
            // Caso a Tarefa não seja Encontrada:
            if(!task){
                return res.status(404).json({erro: "Task not found."});
            }

            // Atualiza a Tarefa:
            await task.update(req.body);   
            return res.status(200).json(task);

        }catch(err){
           console.error(err);
            return res.status(500).json({ error: 'Error updating task.' });
        }
    }

    async delete(req, res){
        try{

            // Busca pelo Id da Tarefa
            const { task_id } = req.params;
            const task = await Task.findByPk(task_id);
            
            // Caso a Tarefa não seja Encontrada:
            if(!task){
                return res.status(404).json({erro: "Task not found."});
            }
            
            // Usuário Inválido:
            if(task.user_id !== req.userId){
                return res.status(401).json({erro: "Invalid user."});
            }
            
            // Deleta a Tarefa:
            await task.destroy();
            return res.status(200).send();
        }catch(err){
            console.error(err);
             return res.status(500).json({ error: 'Error deleting task.' });
        }
    }
}

export default new TaskController();