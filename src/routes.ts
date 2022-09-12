import { ForgotPassword, ResetPassword } from './controller/forgot.controller';
import { Login, Register, AuthenticatedUser, Refresh, Logout } from './controller/auth.controller';
import { Router } from "express";

export const routes = (router:Router)=>{
    router.post('/api/register',Register);
    router.post('/api/login',Login);
    router.get('/api/user',AuthenticatedUser);
    router.post('/api/refresh',Refresh);
    router.post('/api/logout',Logout);
    router.post('/api/forgot',ForgotPassword);
    router.post('/api/reset',ResetPassword);


}