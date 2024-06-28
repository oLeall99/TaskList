import * as Yup from 'yup';
import User from '../models/User';

class UserController{
    async store(req,res){
        try{
            // Schema de verificação do body:
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                password: Yup.string().required().min(6),
            });
            
            // Verificação se os dados do usuário foram enviados corretamente:
            if(!(await schema.isValid(req.body))){
                return res.status(400).json({erro: "Error in Validation."})
            }
            
            // Verificação se já existe um usuário com o email informado:
            const userExists = await User.findOne({
                where: { email: req.body.email },
            });
            if(userExists) {
                return res.status(400).json({erro: "Email already in use."})
            }
            
            // Criação do Usuário:
            await User.create(req.body);
            
            return res.status(200).json({ description: "user created successfully."});
        }catch(err){
            return res.status(501).json({ description: "Error creating user."});
        }
    }

    async update(req, res){
        const passwordSchema = Yup.object().shape({
            oldPassword: Yup.string().required().min(6),
            password: Yup.string().required().min(6),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Passwords must match'),
        });

        const userSchema = Yup.object().shape({
            name: Yup.string().optional(),
            email: Yup.string().email().optional(),
        });        
        
        try {
            const { name, email, oldPassword, password, confirmPassword } = req.body;
            const user = await User.findByPk(req.userId);
    
            if (!user) {
                return res.status(401).json({ error: "User not found." });
            }
    
            // Caso 1: Atualização de senha
            if (oldPassword || password || confirmPassword) {
                await passwordSchema.validate(req.body, { abortEarly: false });
    
                if (!(await user.comparePassword(oldPassword))) {
                    return res.status(400).json({ error: 'Incorrect current password.' });
                }
    
                if (password !== confirmPassword) {
                    return res.status(400).json({ error: 'Passwords do not match.' });
                }
    
                // Atualiza a senha
                await user.update({ password });
    
                return res.status(200).json({ message: "Password updated successfully." });
            }
    
            // Caso 2: Atualização de nome e email
            await userSchema.validate(req.body, { abortEarly: false });
    
            if (email && email !== user.email) {
                const userExists = await User.findOne({ where: { email } });
    
                if (userExists) {
                    return res.status(400).json({ error: "Email already in use." });
                }
            }
    
            // Atualiza o usuário
            await user.update({ name, email });
    
            return res.status(200).json({
                id: user.id,
                name: name || user.name,
                email: email || user.email,
            });
    
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors = err.inner.reduce((acc, error) => {
                    acc[error.path] = error.message;
                    return acc;
                }, {});
                return res.status(400).json({ error: "Validation fails", messages: validationErrors });
            }
            return res.status(500).json({ error: "Error updating user." });
        }
    }

    async find(req,res){
        try{

            // Busca o usuário pelo Id salvo no token:
            const user = await User.findByPk(req.userId);

            // Caso não encontre o usuário retorna status 401:
            if(!user){
                return res.status(401).json({erro: "User not find."});
            }

            // Retorna os dados do usuário:
            const { name, email, id } = user;
            return res.status(200).json({
                name, 
                email,
                id
            })

        }catch(err){
            return res.status(501).json({ description: "Error finding user."});
        }


    }
}

export default new UserController();