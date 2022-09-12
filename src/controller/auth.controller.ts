import { User } from './../entity/user.entity';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcryptjs from 'bcryptjs'
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