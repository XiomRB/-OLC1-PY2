import {Router} from 'express';
var parser = require("../Gramatica/gramatica").parser;
import Clase from '../AnalizarCopia/Clase'
import Nodo from '../Arbol/Nodo'
import Variable from '../AnalizarCopia/Variable'
import Funcion from '../AnalizarCopia/Metodo'
import {Errores} from '../Arbol/Errores'

const router:Router = Router();
var resultadoprincipal:Nodo;
var listacopias:Array<Nodo> = [];

router.post('/',(req,res)=>{
    var entrada = req.body.text;
    var resultado;
    Errores.clear();
    if(entrada != "") {
        resultadoprincipal = parser.parse(entrada)
        if(Errores.verificarerror() == "Se Detectaron Errores de Compilacion"){
            resultado = "Existen errores en el archivo"
        }else resultado = convertir(entrada);
    }
    else resultado = "No hay texto"
    res.send(resultado)
})

router.post('/textos',(req,res)=>{
    var entrada = req.body['text[]']
    listacopias = []
    Errores.clear()
    let r = "Archivos analizados"
    if(entrada.length > 3){
        let nodoN:Nodo = parser.parse(entrada)
        if(Errores.verificarerror() == "Se Detectaron Errores de Compilacion") r = "Errores en los archivos"
        else listacopias.push(nodoN)
    }else{
        for (let index = 0; index < entrada.length; index++) {
            let nodoN:Nodo = parser.parse(entrada[index])
            if(Errores.verificarerror() == "Se Detectaron Errores de Compilacion"){
                r = "Errores en los archivos"
                break
            }
            listacopias.push(nodoN)
        }
    }
    res.send(r)
});

router.post('/textos/errores',(req,res)=>{
    let r = Errores.geterror()
    res.send(r)
})

router.post('/textos/clase',(req,res)=>{
    let entrada = req.body.text
    let r = analizarCopiasClase()
    res.send(r)
});

router.post('/textos/funcion',(req,res)=>{
    let r ;
    r = analizarCopiasFunciones()
    res.send(r)
});

router.post('/textos/variable',(req,res)=>{
    let r ;
    r = analizarCopiasVariables()
    res.send(r)
});

function analizarCopiasClase(){
    let reporte:string  = "";
    for (let index = 0; index < listacopias.length; index++) {
        let copia = new Clase()
        copia.verificar(resultadoprincipal,listacopias[index])
        if(copia.clasecopia) reporte +=  "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>" + copia.metodos + "</td><td>" + copia.funciones + "</td></tr>\n"
        else reporte += "<tr><td>" + index + "</td><td>---</td><td>---</td><td>---</td></tr>\n"
    }
    return reporte
}

function analizarCopiasFunciones(){
    let reporte:string  = "";
    for (let index = 0; index < listacopias.length; index++) {
        let copia = new Funcion()
        copia.verificar(resultadoprincipal,listacopias[index])
        if(copia.listafunciones.length == 0) reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>---</td><td>---</td><td>---</td></tr>"
        for (let i = 0; i < copia.listafunciones.length; i++) {
            reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>" + copia.listafunciones[i] + "</td><td>" + copia.listaparametros[i] + "</td><td>" + copia.listaretornos[i] + "</td></tr>\n"
        }
    }
    return reporte
}

function analizarCopiasVariables(){
    let reporte  = ""
    for (let index = 0; index < listacopias.length; index++) {
        let copia = new Variable()
        copia.verificar(resultadoprincipal,listacopias[index])
        if(copia.variables.length == 0)reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>---</td><td>---</td></tr>"
        for (let i = 0; i < copia.variables.length; i++) {
            for (let j = 0; j < copia.variables[i].nombre.length; j++) {
                if(copia.variables[i].nombre[j].esCopia){
                     reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>" + copia.variables[i].funcion + "</td><td>"
                     reporte += copia.variables[i].tipo + " " + copia.variables[i].nombre[j].nombre + "</td></tr>\n"
                    //else reporte += copia.variables[i].tipo + " " + copia.variables[i].nombre[j].nombre + "<br>"
                }
            }
            //reporte += "</td></tr>\n"
        }
    }
    return reporte
}

function parsear(texto:String){
    return JSON.stringify(parser.parse(texto),null,2)
}

function convertir(texto:String){
    var jsonGramatica = parsear(texto);
    for (let index = 0; index < jsonGramatica.length; index++) {
        jsonGramatica =  jsonGramatica.replace('tipo','id":'+'"'+index.toString()+'",'+'\n \t "nodo');
    }
    var retorno = jsonGramatica.split('valor').join('text').split('sentencias').join('children');
    return retorno;
}

export default router;