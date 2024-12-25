import express from "express";
import { createComment, deleteComment, editComment, getcomments, getPostComments, likeComment } from "../controllers/comment.contoller.js";
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments)
router.put('/likeComment/:commentId', verifyToken, likeComment)
router.put('/editComment/:commentId', verifyToken, editComment)
router.delete('/delete/:commentId', verifyToken, deleteComment)
router.get('/getcomments',verifyToken, getcomments)

export default router
