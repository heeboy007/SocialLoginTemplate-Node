import express from 'express';
import auth from './auth';
import user from './user';
import ensureLogin from '../validator/ensureLogin';

const authRouter = express.Router();
const emailTokenRouter = express.Router();
const profileRouter = express.Router();

//app.use('/auth', authRouter);
authRouter.post('/register', auth.register);
authRouter.post('/login', auth.login);
authRouter.get('/check', auth.check);
authRouter.post('/logout', auth.logout);
authRouter.post('/google', auth.googleIdToken);
authRouter.post('/googleacc', auth.googleAccToken);

//app.use('/profile', profileRouter);
profileRouter.get('/get', ensureLogin, user.getProfile);

export { authRouter, emailTokenRouter, profileRouter };