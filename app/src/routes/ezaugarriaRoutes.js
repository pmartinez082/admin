import express from 'express';
import * as eC from '../controllers/ezaugarriaController.js';
const router = express.Router();

router.get('/', eC.getEzaugarriak); // 3000/ezaugarria/
router.get('/:idEzaugarria', eC.getEzaugarria); // 3000/ezaugarria/1
router.delete('/delete/', eC.deleteEzaugarria); // 3000/ezaugarria/delete/
router.put('/update/', eC.updateEzaugarria); //3000/ezaugarria/update/
router.post('/add', eC.createNewEzaugarria); // 3000/ezaugarria/add


export default router;