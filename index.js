import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './app/router.js';
import fs from 'fs';
import https from 'https';

//* Initializations
const app = express();

//* Settings
//const port = 443;
const host = '192.168.137.1'; 
const port = 3000;
//const host = 'putxerapp.eus';
//* Middlewares
app.use(morgan('dev'));

//* Enabling cors for all request by usiing cors middleware
app.use(cors({
    origin: ['https://pmartinez082.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


/**
 * * Parse request of content-type: application/json
 * * Parses inconming request with JSON payloads
 */
app.use(express.json());
app.use(express.urlencoded( { extended:true }));


//* Routes
router(app);

const options = {
    key: fs.readFileSync('https/server.key'),
    cert: fs.readFileSync('https/server.cert')
};

https.createServer(options, app).listen(port, host, () => {
    console.log(`Server running at https://${host}:${port}`);
});
/*

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});*/
