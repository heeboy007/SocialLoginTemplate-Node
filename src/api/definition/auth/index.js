import express from 'express';
import { google } from './google.js';
import { check, logout } from './misc.js';
import { wrapWithErrorHandler } from '../../errorHandler.js';
import { kakao } from './kakao.js';

const { 
    google: wgoogle, 
    logout: wlogout, 
    check: wcheck,
    kakao: wkakao 
} = wrapWithErrorHandler({
    google,
    logout,
    check,
    kakao
});

const authRouter = express.Router();
const authPath = "/auth";

authRouter.post('/google', wgoogle);
authRouter.post('/kakao', wkakao);
authRouter.get('/check', wlogout);
authRouter.post('/logout', wcheck);

export { 
    authRouter, 
    authPath
};