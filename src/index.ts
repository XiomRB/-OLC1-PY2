import express from 'express'
import rutas from './rutas'
var cors = require('cors')

const app = express();

//configs
app.set('port', process.env.PORT||3000);

//middlewares
app.use(express.json()); //interpreta json restapi
app.use(express.urlencoded({extended:false}));
app.use(cors());

//rutas
app.use('/api',rutas);

//iniciando servidor
app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
})