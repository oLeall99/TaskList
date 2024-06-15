import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth'

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verificação se exite um Header:
    if(!authHeader){
        return res.status(401).json({ erro: 'Token Não Existe.'})
    }

    // Coleta do Token:
    const [ , token] = authHeader.split(' ');

    try{

        // Verifica o token do Usuário:
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        
        // Recebe o id do usuário conectado:
        req.userId = decoded.id;
        return next();

    }catch (err){
        return res.status(401).json({ erro: 'Token Inválido.'})
    }

    console.log(authHeader);
}