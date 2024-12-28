import { Router } from 'express';
import { register, registerPage } from '../controllers/authController.js';

const registerRouter = Router();

// Rota para acessar a página de registro
registerRouter.get('/', registerPage);

// Rota de registro
registerRouter.post('/', register);

export default registerRouter;
