import { User } from './../entity/user.entity';
import { Reset } from './../entity/reset.entity';
import { getRepository } from 'typeorm';
import { Request, Response } from "express";
import { createTransport } from 'nodemailer';
import bcryptjs from 'bcryptjs'


export const ForgotPassword = async (req:Request, res:Response) => {
    const {email} = req.body;
    const token = Math.random().toString(20).substring(2,12);

    await getRepository(Reset).save({
        email,
        token
    })
    const transporter = createTransport({
        host: "0.0.0.0",
        port: 1025,
    });

    const url = `http://localhost:3000/reset/${token}`;

    await transporter.sendMail({
        from: 'from@exmple.com',
        to: email,
        subject: 'Reset password!',
        html: `Click <a href="${url}">here</a> to  Reset your password`
    })

    res.send({
        message: 'Check your email to reset your password'
    })
}

export const ResetPassword = async (req:Request, res:Response) => {
    const {token,password,password_confirm} = req.body;
    if(req.body.password !== req.body.password_confirm){
        return res.status(400)
        .send({
         message:"Password's do not match!"
        }) 
     }
     const ResetPassword = await getRepository(Reset).findOne({
            where:{
                token
            }
        });
    if(!ResetPassword){
        return res.status(400).send({
            message:'Invalide link !'
        })
    }

    const user = await getRepository(User).findOne({
        where:{
            email:ResetPassword.email
        }
    });

    if(!user){
        return res.status(404).send({
            message:'user not found !'
        })
    }
    
    await getRepository(User).update(user.id,{
        password:await bcryptjs.hash(password,12)
    })

    await getRepository(Reset).delete(ResetPassword.id);
    res.send({
        message:'Password updated successfully'
    })


}