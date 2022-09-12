import { Login, Register, AuthenticatedUser } from './controller/auth.controller';
import { Router } from "express";

export const routes = (router:Router)=>{
    router.post('/api/register',Register);
    router.post('/api/login',Login);
    router.get('/api/user',AuthenticatedUser);
}