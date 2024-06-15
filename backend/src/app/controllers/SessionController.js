import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
    async store(req, res){
        const { email, password } = req.body;


        // Verificar se Email exite:
        const user = await User.findOne({where: { email } });
        if(!user){
            return res.status(401).json({ erro: "Credenciais inválidas." });
        }

        // Verificar a senha:
        if(!(await user.comparePassword(password))){
            return res.status(401).json({ erro: "Credenciais inválidas." });
        };

        // Fazer Login de Usuário:
        const { id} = user;
        const token = jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
        });

        return res.status(200).json({
            description: "Sessão iniciada com sucesso.",
            token
        });
    }
}

export default new SessionController();