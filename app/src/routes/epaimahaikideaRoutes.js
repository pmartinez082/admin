import express from 'express';
import * as eC from '../controllers/epaimahaikideaController.js';
const router = express.Router();

router.get('/', eC.getEpaimahaikideak); // 3000/epaimahaikidea/

router.get('/:idEpaimahaikidea', eC.getEpaimahaikidea); // 3000/epaimahaikidea/1
router.delete('/delete/', eC.deleteEpaimahaikidea); // 3000/epaimahaikidea/delete/
router.put('/update/', eC.updateEpaimahaikidea); //3000/epaimahaikidea/update/
router.post('/add', eC.createNewEpaimahaikidea); // 3000/epaimahaikidea/add
router.post('/getEpailearenEpaimahaiak', eC.getEpailearenEpaimahaiak); // 3000/epaimahaikidea/getEpailearenEpaimahaiak
export default router;