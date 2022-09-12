
import { Token } from './../entity/token.entity';
import { User } from './../entity/user.entity';
import { Request, Response } from "express";
import { getRepository, MoreThanOrEqual } from "typeorm";
import bcryptjs from 'bcryptjs'
import {sign,verify} from 'jsonwebtoken'


export const Register = async (req:Request,res:Response)=>{
    const body = req.body;
    if(body.password !== body.password_confirm){
       return res.status(400)
       .send({
        message:"Password's do not match!"
       }) 
    }
    const {password,...user} = await getRepository(User).save({
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
    

    const refreshToken = sign({
        id:user.id
    },process.env.REFRESH_SECRET || '',{expiresIn:'1w'});

   const expiresIn = new Date();
   expiresIn.setDate(expiresIn.getDate() + 7);
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge: 7*24*60*60*1000//7 day
    })
    await getRepository(Token).save({
        user_id:user.id,
        token:refreshToken,
        expired_at:expiresIn

    })
    const token = sign({
        id:user.id
    },process.env.ACCESS_SECRET || '',{expiresIn:'30s'});
    res.send({
        token
    });
}

export const AuthenticatedUser = async (req:Request,res:Response)=>{
    try {
    const accessToken = req.header('Authorization')?.split(' ')[1] || '';
       
        
    const payload:any = verify(accessToken,process.env.ACCESS_SECRET || '');
        
    if (!payload) {
        return res.status(401).send({
            message:'Unauthenticated'
        })
    }

    const user = await getRepository(User).findOne({
        where:{
            id:payload.id
        }
    });
    
    

    if (!user) {
        return res.status(401).send({
            message:'Unauthenticated'
        })
    }
    const {password,...data} = user;

    res.send(data);

    } catch (error) {
        return res.status(401).send({
            message:'Unauthenticated'
        })
    }

}


export const Refresh = async (req:Request,res:Response) => {
  try {
    const accessToken = req.cookies['refreshToken'];
        
    const payload:any = verify(accessToken,process.env.REFRESH_SECRET || '');
    
    if (!payload) {
        return res.status(401).send({
            message:'Unauthenticated'
        })
    }
    const refreshToken = await getRepository(Token).findOne({
        where:{
            user_id:payload.id,
            expired_at:MoreThanOrEqual(new Date())
        }
    });
   
    if (!refreshToken) {
        return res.status(401).send({
            message:'Unauthenticated'
        })
    }

    const token = sign({
        id:payload.id
    },process.env.ACCESS_SECRET || '',{expiresIn:'30s'});

    

    res.send({
        token
     });

    
  } catch (error) {
    return res.status(401).send({
        message:'Unauthenticated'
    })
  }  
    

}

export const Logout = async (req:Request,res:Response) => {

    const token = req.cookies['refreshToken'];
    await getRepository(Token).delete({
        token
    })

    res.cookie('refreshToken','',{
        maxAge:0
    })
    
    res.send({
        message:'success'
     });
}