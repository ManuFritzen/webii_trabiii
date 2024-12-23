import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';  // Armazenar em um .env

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;  // Armazenar dados do usuário decodificado
        next();  // Permitir que a requisição prossiga
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};
