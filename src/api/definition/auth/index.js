import express from 'express';
import auth from './endpoints.js';

const authRouter = express.Router();
const authPath = "/auth";

authRouter.post('/google', auth.google);
authRouter.get('/check', auth.check);
authRouter.post('/logout', auth.logout);

export { 
    authRouter, 
    authPath
};