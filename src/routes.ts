import { Login, Register, AuthenticatedUser, Refresh } from './controller/auth.controller';
import { Router } from "express";

export const routes = (router:Router)=>{
    router.post('/api/register',Register);
    router.post('/api/login',Login);
    router.get('/api/user',AuthenticatedUser);
    router.post('/api/refresh',Refresh);
}