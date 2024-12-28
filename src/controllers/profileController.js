import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function profilePage(req, res) {
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {

        console.log('userId: ' + userId);
        return res.redirect('/login');  
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
            include: {
                profilePhoto: true,  
                permissions: true,   
            },
        });

        if (!user) {
            console.log('user: ' + user);
            return res.redirect('/login');  
        }

        res.render('profile', { user });
    } catch (error) {
        console.error('Erro ao recuperar o perfil:', error);
        res.status(500).json({ message: 'Erro interno ao carregar o perfil.' });
    }
}

export { profilePage };
