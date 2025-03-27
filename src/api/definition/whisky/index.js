import express from 'express';
import whisky from './endpoints.js';
import { ensureLogin } from '../../middleware/ensureLogin.js';

const whiskyRouter = express.Router();

//app.use('/profile', profileRouter);
whiskyRouter.post('/get', ensureLogin, whisky.onBoarding);

export { whiskyRouter };