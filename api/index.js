import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import cookieParser from 'cookie-parser';
import commentRoutes from './routes/comment.routes.js'


dotenv.config();

mongoose
    .connect(
        process.env.MONGO_URI
    ).then(() => {
        console.log('Mongodb is connected')
    }).catch((err) => {
        console.log({ 'Mongodb connection error': err })
    })



const app = express(); //create the application

app.use(express.json()); //allow to send json file to the backend
app.use(cookieParser());


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

app.use('/api/user', userRouter)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)



// a middleware to handle errors more easily
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
