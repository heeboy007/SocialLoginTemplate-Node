import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';


import { jwtMiddleware } from './service/middleware/jwtMiddleware';
import { domain } from './util/const';

const app = express();

app.use(bodyParser.json());
app.use(cors({
    // origin: 'http://localhost:8080',
    // credentials: true
}));
app.use(cookieParser());
app.use(jwtMiddleware);
app.use("/static", express.static(path.resolve() + '/public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', domain);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

async function configureServer(app){
    app.get('/', (req, res) => {
        return res.status(404).send('Nothing Found.');
    });

    // app.use('/auth', authRouter);
    // app.use('/emailToken', emailTokenRouter);
    // app.use('/user', profileRouter);
    // app.use('/avatar', avatarRouter);
    // app.use('/routine', routineRouter);
    // app.use('/workout', workoutRouter);
    // app.use('/analytics', analyticsRouter);
    // app.use('/friends', friendsRouter);
    
    console.log('Connected routers to express.');
}

await configureServer(app);

export default app;