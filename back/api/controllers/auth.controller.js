import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const Signup = async(req, res, next) => { 
    
       const { username, email, password } = req.body;
       if(!username || !email || !password || username === ''|| email === ''|| password === '') {
        // return res.status(400).json('All fields are required')
        next(errorHandler(400, 'All fields are required'));
       };

       const hashPassword = bcryptjs.hashSync( password, 10) // this method has the sync inside itself

       const newUser = new User({
        username,
         email, 
         password : hashPassword, 
       })
       try {
       await newUser.save();
       res.status(201).json('User created successfully')
    } catch (error) {
        next(error) 
        console.error('Error in siguning up new account:', error)        
    }
}

export const signin = async(req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === ''|| password === '') {
        return next(errorHandler(400, 'All fields are required!'));
    };

    try {
        const validUser = await User.findOne( { email })
        if (!validUser) {return next(errorHandler(404, 'User not found!')) }

        const validPass = bcryptjs.compareSync(password, validUser.password);
        if (!validPass) { return next(errorHandler(400, 'Invalid email or password!'))}

        const {password: pass , ...rest} = validUser._doc;
        const token = jwt.sign( { id: validUser._id , isAdmin: validUser.isAdmin } , process.env.JWT_SECRET );
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest);

    } catch (error) {
        next(error)
    }
    
}