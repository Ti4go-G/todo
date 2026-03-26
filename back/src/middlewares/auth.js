import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Por favor, faça login para acessar' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar se o usuário ainda existe
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = user;
        next();
    } catch (error) {
      console.error(error);
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};