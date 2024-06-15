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
                return res.status(400).json({erro: "Falha na Validação."});
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
            return res.status(500).json({ error: 'Erro ao criar Tarefa.' });
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
                return res.status(404).json({ message: 'Nenhuma tarefa encontrada.' });
            }
            
            return res.json(tasks);

        }catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar Tarefas.' });
        }
    }

    async search(req, res){
        try{

            // Verificação se os dados foram enviados corretamente:
            const schema = Yup.object().shape({
            search: Yup.string().required().min(3),
            });
            
            // Verificação se os dados do usuário foram enviados corretamente:
            if(!(await schema.isValid(req.query))){
                return res.status(400).json({erro: "Falha na Validação."});
            }
            
            const { search }  = req.query; 
            
            // Busca todas as Tasks do usuário cujo título contém a string de pesquisa:
            const tasks = await Task.findAll({
                where: {
                    user_id: req.userId,
                    title: {
                        [Op.like]: `%${search}%`
                    }
                },
                order: [['status', 'ASC']] // Ordena as tarefas pelo status em ordem crescente
            });
            
            // Verifica se a lista de tarefas está vazia:
            if (tasks.length === 0) {
                return res.status(404).json({ message: 'Nenhuma tarefa encontrada.' });
            }
            
            
            return res.status(200).json(tasks);
            
        }catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar Tarefa(s).' });
        }
    }

    async update(req, res){
        try{
            // Verificação se os dados foram enviados corretamente:
            const schema = Yup.object().shape({
                title: Yup.string().notRequired(),
                status: Yup.number().min(1).max(3).notRequired(),
                desc: Yup.string().notRequired(),
            });
            
            // Verificação se os dados do usuário foram enviados corretamente:
            if(!(await schema.isValid(req.body))){
                return res.status(400).json({erro: "Falha na Validação."});
            }
            
            // Busca pelo Id da Tarefa
            const { task_id } = req.params;
            const task = await Task.findByPk(task_id);
            
            // Caso a Tarefa não seja Encontrada:
            if(!task){
                return res.status(400).json({erro: "Tarefa Não Existe."});
            }

            // Atualiza a Tarefa:
            await task.update(req.body);   
            return res.status(200).json(task);

        }catch(err){
           console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar Tarefa.' });
        }
    }

    async delete(req, res){
        try{

            // Busca pelo Id da Tarefa
            const { task_id } = req.params;
            const task = await Task.findByPk(task_id);
            
            // Caso a Tarefa não seja Encontrada:
            if(!task){
                return res.status(400).json({erro: "Tarefa Não Existe."});
            }
            
            // Usuário Inválido:
            if(task.user_id !== req.userId){
                return res.status(401).json({erro: "Usuário Inválido."});
            }
            
            // Deleta a Tarefa:
            await task.destroy();
            return res.status(200).send();
        }catch(err){
            console.error(err);
             return res.status(500).json({ error: 'Erro ao deletar Tarefa.' });
        }
    }
}

export default new TaskController();