import express from "express";
import expressAsyncHandler from "express-async-handler"
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import {isAuth, generateToken } from "../utils.js";
const userRouter = express.Router();

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email: email})
    if(user){
        if(bcrypt.compareSync(password, user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password'})
}))

userRouter.post('/signup', expressAsyncHandler(async (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({ name:name, email: email, password: bcrypt.hashSync(password)});
    const user = await newUser.save();
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    });
}))


userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res)=>{
    const user = await User.findById(req.user._id);
        
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 8)
        }

        const updatedUser = await user.save();

        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser)
        })
    } else {
        res.status(404).send({ message: 'User not found'})
    }

}))
export default userRouter;