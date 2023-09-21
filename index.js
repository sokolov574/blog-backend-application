import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import cors from 'cors';


import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB err', err));



const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/auth/login',  loginValidation, handleValidationErrors, login);
app.post('/auth/register',registerValidation, handleValidationErrors, register);
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors,PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK')
});


