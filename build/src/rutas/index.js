"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var parser = require("../Gramatica/gramatica").parser;
var Clase_1 = __importDefault(require("../AnalizarCopia/Clase"));
var Variable_1 = __importDefault(require("../AnalizarCopia/Variable"));
var Metodo_1 = __importDefault(require("../AnalizarCopia/Metodo"));
var Errores_1 = require("../Arbol/Errores");
var router = express_1.Router();
var resultadoprincipal;
var listacopias = [];
router.post('/', function (req, res) {
    var entrada = req.body.text;
    var resultado;
    Errores_1.Errores.clear();
    if (entrada != "") {
        resultadoprincipal = parser.parse(entrada);
        if (Errores_1.Errores.verificarerror() == "Se Detectaron Errores de Compilacion") {
            resultado = "Existen errores en el archivo";
        }
        else
            resultado = convertir(entrada);
    }
    else
        resultado = "No hay texto";
    res.send(resultado);
});
router.post('/textos', function (req, res) {
    var entrada = req.body['text[]'];
    listacopias = [];
    Errores_1.Errores.clear();
    var r = "Archivos analizados";
    if (entrada.length > 3) {
        var nodoN = parser.parse(entrada);
        if (Errores_1.Errores.verificarerror() == "Se Detectaron Errores de Compilacion")
            r = "Errores en los archivos";
        else
            listacopias.push(nodoN);
    }
    else {
        for (var index = 0; index < entrada.length; index++) {
            var nodoN = parser.parse(entrada[index]);
            if (Errores_1.Errores.verificarerror() == "Se Detectaron Errores de Compilacion") {
                r = "Errores en los archivos";
                break;
            }
            listacopias.push(nodoN);
        }
    }
    res.send(r);
});
router.post('/textos/errores', function (req, res) {
    var r = Errores_1.Errores.geterror();
    res.send(r);
});
router.post('/textos/clase', function (req, res) {
    var entrada = req.body.text;
    var r = analizarCopiasClase();
    res.send(r);
});
router.post('/textos/funcion', function (req, res) {
    var r;
    r = analizarCopiasFunciones();
    res.send(r);
});
router.post('/textos/variable', function (req, res) {
    var r;
    r = analizarCopiasVariables();
    res.send(r);
});
function analizarCopiasClase() {
    var reporte = "";
    for (var index = 0; index < listacopias.length; index++) {
        var copia = new Clase_1.default();
        copia.verificar(resultadoprincipal, listacopias[index]);
        if (copia.clasecopia)
            reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>" + copia.metodos + "</td><td>" + copia.funciones + "</td></tr>\n";
        else
            reporte += "<tr><td>" + index + "</td><td>---</td><td>---</td><td>---</td></tr>\n";
    }
    return reporte;
}
function analizarCopiasFunciones() {
    var reporte = "";
    for (var index = 0; index < listacopias.length; index++) {
        var copia = new Metodo_1.default();
        copia.verificar(resultadoprincipal, listacopias[index]);
        if (copia.listafunciones.length == 0)
            reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>---</td><td>---</td><td>---</td></tr>";
        for (var i = 0; i < copia.listafunciones.length; i++) {
            reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>" + copia.listafunciones[i] + "</td><td>" + copia.listaparametros[i] + "</td><td>" + copia.listaretornos[i] + "</td></tr>\n";
        }
    }
    return reporte;
}
function analizarCopiasVariables() {
    var reporte = "";
    for (var index = 0; index < listacopias.length; index++) {
        var copia = new Variable_1.default();
        copia.verificar(resultadoprincipal, listacopias[index]);
        if (copia.variables.length == 0)
            reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>---</td><td>---</td></tr>";
        for (var i = 0; i < copia.variables.length; i++) {
            reporte += "<tr><td>" + (index + 1) + "</td><td>" + copia.nombre + "</td><td>" + copia.variables[i].funcion + "</td><td>";
            for (var j = 0; j < copia.variables[i].nombre.length; j++) {
                if (j == copia.variables[i].nombre.length - 1)
                    reporte += copia.variables[i].tipo + " " + copia.variables[i].nombre[j];
                else
                    reporte += copia.variables[i].tipo + " " + copia.variables[i].nombre[j] + "<br>";
            }
            reporte += "</td></tr>\n";
        }
    }
    return reporte;
}
function parsear(texto) {
    return JSON.stringify(parser.parse(texto), null, 2);
}
function convertir(texto) {
    var jsonGramatica = parsear(texto);
    for (var index = 0; index < jsonGramatica.length; index++) {
        jsonGramatica = jsonGramatica.replace('tipo', 'id":' + '"' + index.toString() + '",' + '\n \t "nodo');
    }
    var retorno = jsonGramatica.split('valor').join('text').split('sentencias').join('children');
    return retorno;
}
exports.default = router;
