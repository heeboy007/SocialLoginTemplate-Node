import express from 'express';
import { google } from './google.js';
import { check, logout } from './misc.js';
import { wrapWithErrorHandler } from '../../errorHandler.js';

const { google: wgoogle, logout: wlogout, check: wcheck } = wrapWithErrorHandler({
    google,
    logout,
    check
});

const authRouter = express.Router();
const authPath = "/auth";

authRouter.post('/google', wgoogle);
authRouter.get('/check', wlogout);
authRouter.post('/logout', wcheck);

export { 
    authRouter, 
    authPath
};