import express from 'express';
import path from 'path';

const isPkg = typeof process.pkg !== 'undefined';
const basePath = isPkg
    ? path.dirname(process.execPath)
    : path.resolve();

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html', 'index.html'));
});
router.get('/admin', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html', 'admin.html'));
});
router.get('/berria', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html', 'berria.html'));
});
router.get('/berria/txapelketa', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html', 'txapelketaBerria.html'));
});
router.get('/berria/taldea', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html', 'taldeBerria.html'));
});
router.get('/ezabatu/txapelketa', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html',  'txapelketaEzabatu.html'));
});
router.get('/ezabatu/taldea', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html',  'taldeaEzabatu.html'));
});
router.get('/txapelketak', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html',  'txapelketakView.html'));
});
router.get('/faseak', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html',  'faseakView.html'));
});
router.get('/podium', (req, res) => {
    res.sendFile(path.join(basePath, 'app', 'src', 'views', 'html', 'kalkuluak.html'));
});

router.use('/css', express.static(path.join(basePath, 'app', 'src', 'views', 'css')));
router.use('/js', express.static(path.join(basePath, 'app', 'src', 'views', 'js')));
router.use('/pics', express.static(path.join(basePath, 'app', 'src', 'views', 'pics')));
router.use('/icons', express.static(path.join(basePath, 'app', 'src', 'views', 'icons')));
router.use('/pwa', express.static(path.join(basePath, 'app',  'pwa')));

export default router;
