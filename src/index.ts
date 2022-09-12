 import  express from "express";
import { createConnection } from "typeorm";
import { routes } from './routes';

createConnection().then(()=>{
    console.log("Connected to database");
    const app = express();

 app.use(express.json());// for parsing application/json

 routes(app);

 app.listen(8000, () => {
    console.log('Server started on port 8000');
 }
)
})   
 