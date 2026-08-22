import { User } from "../models/User.js";
import jwt from 'jsonwebtoken'

// Helper to set cookies
const setSessionCookie = (res, payload) =>{
    const  JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn :'30d'});

    res.cookie('token', token,{
        httpOnly : true,
        secure: process.env.NODE_ENV == 'production',
        sameSite:'lax',
        maxAge:30 * 24* 60 * 60 * 1000, // 30days
        path:'/'
    });
};

export async function register(req, res) {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({error:'name, email, and password are required'});
        }

        const trimmedEmail = email.toLowerCase().trim();

        const existing = await User.findOne({email: trimmedEmail});

        if (existing){
            return res.status(400).json({error:'An account with this email already exists'});
        }
        const user = await User.create({
            name, 
            email:trimmedEmail,
            password
        });

        setSessionCookie(res, {
            userId:user.id.toString(),
            email:user.email
        });

        res.status(201).json({
            user:{
                _id:user.id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        console.error('Registration failed:', error);
        res.status(500).json({error:'Failed to register user'})
    }
}

export async function login(req, res) {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:'email and password are required'});
        }

        const user = await User.findOne({email:email.toLowerCase().trim() });

        if(!user){
            return  res.status(401).json({error:'Invalid email or password'});
        }

        const isValid = await user.comparePassword(password);

        if(!isValid){
            return res.status(401).json({error:'Invalid email or password'})
        }

        setSessionCookie(res,{
            userId: user.id.toString(),
            email:user.email
        });

        res.status(200).json({
            user:{
                _id:user.id,
                name:user.name,
                email:user.email
            }
        })
    }catch(error){
        console.error('Login failed:',error)
        res.status(500).json({error:'Failed to login'})
    }
}

export async function logout(_req, res){
    res.cookie('token','',{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'lax',
        maxAge:0,
        path:'/'
    });
    res.json({ success: true });
}

export async function me(req, res){
    try{
        if (!req.user){
            return res.status(401).json({error:'Not authorized'});
        }

        const user = await User.findById(req.user.userId).select('-password');

        if(!user){
            return res.status(404).json({error:'User not found'});
        }

        res.json({ user });
    }catch(error){
        console.error('Failed to fetch user: ', error);
        res.status(500).json({error: 'Failed to fetch user data'});
    }
}