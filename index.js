import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './app/router.js';

//* Initialization
const app = express();

//* Configuration
const host = '192.168.137.1';
const port = 3000;

//* Configure CORS properly with preflightContinue: true
app.use(cors({
   // origin: 'https://pmartinez082.github.io/*', 
   origin: 'https://private-network-access-permission-test.glitch.me',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: true  // Importante para que nuestro middleware custom se ejecute después
}));

//* Custom Middleware para agregar los encabezados de red privada en todas las respuestas
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    res.setHeader('Private-Network-Access-Name', 'zerbitzaria');
    res.setHeader('Private-Network-Access-ID', '9A:BD:80:BE:EF:01');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.sendStatus(204);
    }
    next();
});

//* Otros Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Routes
router(app);

//* Start server
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
