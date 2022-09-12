require('dotenv').config()
import  express from "express";
import { createConnection } from "typeorm";
import { routes } from './routes';
import cors from 'cors';
import { config } from "dotenv";
createConnection().then(()=>{
    console.log("Connected to database");
    const app = express();

    app.use(express.json());// for parsing application/json
    app.use(cors({
        origin:['http://localhost:3000',],
        credentials:true
}))
 routes(app);

 app.listen(8000, () => {
    console.log('Server started on port 8000');
 }
)
})   
 