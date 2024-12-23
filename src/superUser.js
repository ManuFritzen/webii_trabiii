import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createSuperUser() {
    try {
        const superUser = await prisma.user.findFirst({
            where: { email: 'manu@manu.com' }, 
        });

        if (!superUser) {
            const hashedPassword = await bcrypt.hash("123", 10); 
            const newSuperUser = await prisma.user.create({
                data: {
                    name: 'manu',
                    email: 'manu@manu.com',
                    password: "123", 
                    role: 'SUPERUSER',
                },
            });

            console.log(`Superusuário criado com sucesso.`);
            console.log(`Nome: ${newSuperUser.name}`);
            console.log(`Senha: ${newSuperUser.password}`);
        } else {
            console.log('Superusuário já existe.');
        }
    } catch (error) {
        console.error('Erro ao criar superusuário:', error);
    } finally {
        await prisma.$disconnect(); 
    }
}


