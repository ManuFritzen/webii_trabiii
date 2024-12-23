import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { createSuperUser } from './superUser.js';
import  router from './routes/index.routes.js';


import { authMiddleware } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');  
app.set('views', 'views');  

// Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Chamar a criação do superusuário ao iniciar o servidor
createSuperUser();


// Rota protegida que exige autenticação
app.get('/api/protected', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Você tem acesso a esta rota protegida.',
        user: req.user,  // Dados do usuário autenticado
    });
});

// Redirecionar para a página de login caso o usuário tente acessar a raiz
app.get('/', (req, res) => res.redirect('/login'));

app.use("/", router);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server iniciado na porta ${PORT}`));
