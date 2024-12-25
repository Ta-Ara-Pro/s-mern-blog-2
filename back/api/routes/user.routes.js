import express from 'express'
import { deleteUser, getUser, getusers, signout, test, updateUser } from '../controllers/user.controller.js';
import { ImageUploader, uploadMiddleware } from '../controllers/imageUpload.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',  test)
router.put('/update/:userId',verifyToken, updateUser )

router.post('/cloudinary', uploadMiddleware, ImageUploader);

router.delete('/delete/:userId',verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/getusers', verifyToken, getusers)
router.get('/:userId', getUser)


export default router;