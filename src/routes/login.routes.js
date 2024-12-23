import {login, loginPage}  from '../controllers/authController.js';
import { Router } from 'express';


const loginRouter = Router();


loginRouter.get('/login' , loginPage);
loginRouter.post('/login' , login);

export default loginRouter;
