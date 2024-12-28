import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createSuperUser() {
    try {
        const superUser = await prisma.user.findFirst({
            where: { email: 'manu@manu.com' },
        });

        if (!superUser) {
            await prisma.user.create({
                data: {
                    name: 'manu',
                    email: 'manu@manu.com',
                    password: bcrypt.hashSync('1234', 10), 
                    role: 'SUPERUSER',
                },
            });
            console.log('Superusuário criado com sucesso.');
            console.log('email:' + data.email);
            console.log('senha:' + data.password);
        } else {
            console.log('Superusuário já existe.');
            console.log('email:' + superUser.email);
            console.log('senha: 1234');
        }
    } catch (error) {
        console.error('Erro ao criar superusuário:', error);
    } finally {
        await prisma.$disconnect(); 
    }
}
