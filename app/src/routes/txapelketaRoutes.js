import express from 'express';
import * as tC from '../controllers/txapelketaController.js';
const router = express.Router();

router.get('/', tC.getTxapelketak); // 3000/txapelketa/
router.get('/:idTxapelketa', tC.getTxapelketa); // 3000/txapelketa/1
router.get('/lortu/info-guztia', tC.getInfoGuztia); // 3000/lortu/info-guztia
router.get('/lortu/info-guztia/:idTxapelketa', tC.getTxapelketarenInfoGuztia); // 3000/lortu/info-guztia/1
router.get('/faseak/:idTxapelketa', tC.getTxapelketarenFaseak); // 3000/txapelketa/faseak/1
router.get('/lortu/aktiboaren-info-guztia', tC.getTxapAktiboaFasEpaimahaikideakEzaugarriak); // 3000/txapelketa/lortu-aktiboaren-info-guztia
router.get('/:idTxapelketa', tC.getTxapelketa); // 3000/txapelketa/1
router.delete('/delete/', tC.deleteTxapelketa); // 3000/txapelketa/delete/
router.put('/update/', tC.updateTxapelketa); //3000/txapelketa/update/
router.post('/add', tC.createNewTxapelketa); // 3000/txapelketa/add


export default router;