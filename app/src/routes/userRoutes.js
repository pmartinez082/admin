import express from 'express';
import * as uC from '../controllers/userController.js';
const router = express.Router();

router.get('/', uC.getUsers); // 3000/user/
router.get('/role/epaileak/', uC.getReferees); // 3000/user/epaileak
router.delete('/delete/', uC.deleteUser); // 3000/user/delete/
router.put('/update/', uC.updateUser); //3000/user/update/
router.post('/add', uC.createNewUser); // 3000/user/add
router.post('/verify', uC.verifyUser); // 3000/user/verify
router.post('/find', uC.findUser); // 3000/user/find
router.post('/role', uC.getRole); // 3000/user/role
export default router;