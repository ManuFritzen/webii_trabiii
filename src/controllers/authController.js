import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';  

async function register(req, res) {
    const { name, email, password } = req.body;

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
                role: 'USER',  // ou 'SUPERUSER' se você estiver criando um superusuário
            },
        });

        res.status(201).json({ message: 'Usuário registrado com sucesso.', user });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

// Função para renderizar a página de login
function loginPage(req, res) {
    try {
        res.render('login'); 
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

        const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login realizado com sucesso.',
            token,
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

export { login, loginPage, register };
