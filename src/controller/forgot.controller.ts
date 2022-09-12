import { Reset } from './../entity/reset.entity';
import { getRepository } from 'typeorm';
import { Request, Response } from "express";
import { createTransport } from 'nodemailer';



export const Forgot = async (req:Request, res:Response) => {
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