import { User } from './../entity/user.entity';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcryptjs from 'bcryptjs'
import {sign} from 'jsonwebtoken'
export const Register = async (req:Request,res:Response)=>{
    const body = req.body;
    if(body.password !== body.password_confirm){
       return res.status(400)
       .send({
        message:"Password's do not match!"
       }) 
    }
    const user = await getRepository(User).save({
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        password:await bcryptjs.hash(body.password,12)
    })
    res.send(user);
}

export const Login = async (req:Request,res:Response)=>{
    const user = await getRepository(User).findOne({
        where:{
            email:req.body.email
        }
    });
    if(!user){
        return res.status(400).send({
            message:'Invalide credentials'
        })
    }
    if (!await bcryptjs.compare(req.body.password,user.password)) {
        return res.status(400).send({
            message:'Invalide credentials'
        })
    }
    const accessToken = sign({
        id:user.id
    },"access_secret",{expiresIn:'30s'});
    const refreshToken = sign({
        id:user.id
    },"refresh_secret",{expiresIn:'1w'});
    res.cookie('accessToken',accessToken,{
        httpOnly:true,//only get token in cookie by http
        maxAge:24*60*60*1000//1 day
    })
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge: 7*24*60*60*1000//7 day
    })
    res.send({
       message:'success'
    });
}