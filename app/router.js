
import adminRoutes from './src/routes/adminRoutes.js';
import txapelketaRoutes from './src/routes/txapelketaRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import taldeaRoutes from './src/routes/taldeaRoutes.js';
import epaimahaikideaRoutes from './src/routes/epaimahaikideaRoutes.js';
import ebaluazioaRoutes from './src/routes/ebaluazioaRoutes.js';
import faseaRoutes from './src/routes/faseaRoutes.js';
import ezaugarriaRoutes from './src/routes/ezaugarriaRoutes.js';

const router = (app) => {
    app.use('/', adminRoutes)
    app.use('/txapelketa', txapelketaRoutes);
    app.use('/user', userRoutes);
    app.use('/taldea', taldeaRoutes);
    app.use('/epaimahaikidea', epaimahaikideaRoutes);
    app.use('/ebaluazioa', ebaluazioaRoutes);
    app.use('/fasea', faseaRoutes);
    app.use('/ezaugarria', ezaugarriaRoutes);
};

export default router;