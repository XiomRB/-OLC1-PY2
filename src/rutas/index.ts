import {Router} from 'express';
var parser = require("../Gramatica/gramatica").parser;

const router:Router = Router();

router.post('/',(req,res)=>{
    var entrada = req.body.text;
    var resultado;
    if(entrada != "") resultado = convertir(entrada);
    else resultado = "No hay texto"
    res.send(resultado)
})

router.post('/textos',(req,res)=>{
    var entrada = req.body.text
});



function parsear(texto:String){
    return JSON.stringify(parser.parse(texto),null,2)
}

function convertir(texto:String){
    var jsonGramatica = parsear(texto);
    for (let index = 0; index < 1000; index++) {
        jsonGramatica =  jsonGramatica.replace('tipo','id":'+'"'+index.toString()+'",'+'\n \t "nodo');
    }
    var retorno = jsonGramatica.split('valor').join('text').split('sentencias').join('children');
    return retorno;
}

export default router;