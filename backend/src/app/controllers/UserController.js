import * as Yup from 'yup';
import User from '../models/User';

class UserController{
    async store(req,res){

        // Schema de verificação do body:
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        // Verificação se os dados do usuário foram enviados corretamente:
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({erro: "Falha na Validação."})
        }

        // Verificação se já existe um usuário com o email informado:
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if(userExists) {
            return res.status(400).json({erro: "Email já em uso."})
        }

        // Criação do Usuário:
        await User.create(req.body);

        return res.status(201).json({ description: "Usuário criado com sucesso."});
    }

    async update(req, res){

        // Schema de verificação do body:
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
                oldPassword ? field.required() : field
                // Verifica se o campo OldPassword foi preenchido
            ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
                // Verifica se o campo confirmPassword e password são iguais
            ),
        });

        // Verificação se os dados do usuário foram enviados corretamente:
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({erro: "Falha na Validação."})
        }

        // Busca pelo usuário:
        const { email, oldPassword } = req.body;
        const user = await User.findByPk(req.userId);

        // Caso o usuário queira modificar seu Email:
        if(email !== user.email){
            const userExists = await User.findOne({
                where: { email },
            });

            if(userExists) {
                return res.status(400).json({erro: "Email já em uso."});
            }
        }

        // Verifica se o usuário deseja modificar sua Senha:
        if(oldPassword && !(await user.comparePassword(oldPassword))){
            return res.status(401).json({ erro: 'Senha Incorreta.'});
        }

        // Atualiza o Usuário:
        const { id, name } = await user.update(req.body);
        
        return res.json({
            id,
            name, 
            email
        });
    }
}

export default new UserController();