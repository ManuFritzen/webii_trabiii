import { Router } from 'express';

import loginRouter from './login.routes.js';
import profileRouter from './profile.routes.js';
import registerRouter from './register.routes.js';

const router = Router();

router.use("/", loginRouter);
router.use("/register", registerRouter);
router.use("/profile", profileRouter);




export default router;