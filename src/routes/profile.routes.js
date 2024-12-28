import express from 'express';
import { profilePage } from '../controllers/profileController.js';

const profileRouter = express.Router();

// Rota para acessar o perfil
profileRouter.get('/', profilePage);  

export default profileRouter;
