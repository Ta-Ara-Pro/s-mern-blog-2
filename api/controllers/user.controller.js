import User from "../models/user.models.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = async(req, res) => {
    try {
        res.json({ "1" :'API is working!',"2": 'user data'})
    } catch (error) {
        console.error('Error in fetching data:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
 
} 


//req.user.id is coming from cookie 
// req.params.userId is coming from requested url

export const updateUser = async(req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }
    if (req.body.password) {
        if ( req.body.password.length < 6 ){
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    // }
    if (req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
    }
    if(req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'))
    }
    if(req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'))
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)){
        return next(errorHandler(400, 'Username can only contain letters and numbers'))
    }
}
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password:req.body.password,
                profilePicture: req.body.profilePicture,
            }
        },
         { new: true}
        )
        const {password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this user'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been delete')
    } catch (error) {
        next(error)
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

export const getusers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 2;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date(); // Correct Date initialization
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1, // Fixed method call with parentheses
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error);
    }
};


export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user){
            return  next(errorHandler(404, 'User not found!'))
        }
        const {password , ...rest} = user._doc;
        // or use: const { password, ...rest } = user.toObject();

        res.status(200).json(rest)
    } catch (error) {
        next(error)
        console.error(error.message); // Log the error for debugging
        next(error);
    }
}