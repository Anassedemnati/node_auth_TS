 import  express,{Request,Response}  from "express";

 const app = express();

 app.use(express.json());// for parsing application/json

 app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
 })

 app.listen(5000, () => {
    console.log('Server started on port 5000');
 }
)