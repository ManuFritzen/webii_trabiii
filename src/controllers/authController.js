import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; 

function registerPage(req, res) {
    try {
        res.render('register'); // Renderiza o arquivo register.ejs
    } catch (error) {
        console.error('Erro ao renderizar página de registro:', error);
        res.status(500).json({ message: 'Erro ao renderizar página de registro.' });
    }
}

async function register(req, res) {
    const { name, email, password} = req.body;

    try {
        // Verificar se o usuário já existe
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe.' });
        }


        // Hashing da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o novo usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',  // Define um papel padrão para o usuário
            },
        });

        // Gerar o token JWT para o usuário (opcional)
        const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

        // Enviar resposta com sucesso
        //res.status(201).json({ message: 'Usuário registrado com sucesso.', user, token });
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

// Função para renderizar a página de login
function loginPage(req, res) {
    try {
        res.render('login');  // Renderiza o arquivo login.ejs
    } catch (error) {
        console.error('Erro ao renderizar página de login:', error);
        res.status(500).json({ message: 'Erro ao renderizar página de login.' });
    }
}

// Função para login do usuário
async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
        }

        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
        }

        // Gerar o token JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

        // Armazenar o token e as informações do usuário na sessão
        req.session.token = token;
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // Redirecionar para a página de perfil
        res.redirect('/profile');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}


export { login, loginPage, register, registerPage };
