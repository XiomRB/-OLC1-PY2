"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Nodo_1 = __importDefault(require("../Arbol/Nodo"));
var Funcion = /** @class */ (function () {
    function Funcion() {
        this.listafunciones = [];
        this.listaparametros = [];
        this.listaretornos = [];
        this.nombre = "---";
    }
    Funcion.prototype.verificar = function (original, copia) {
        var origen = this.verificarFunciones(original, this.listafunciones, this.listaparametros, this.listaretornos);
        var lf = [];
        var lp = [];
        var lr = [];
        var copy = this.verificarFunciones(copia, lf, lp, lr);
        if (origen.valor == copy.valor) {
            this.nombre = origen.valor;
            if (this.listafunciones.length != 0 && lf.length != 0) {
                var i = 0;
                while (i < this.listafunciones.length) {
                    var j = 0;
                    while (j < lf.length) {
                        if (this.listafunciones[i] == lf[j]) {
                            if (this.listaparametros[i] == lp[j]) {
                                if (this.listaretornos[i] == lr[j]) {
                                    i++;
                                    break;
                                }
                            }
                        }
                        if (j == lf.length - 1) {
                            this.listafunciones.splice(i, 1);
                            this.listaparametros.splice(i, 1);
                            this.listaretornos.splice(i, 1);
                            lf.splice(i, 1);
                            lp.splice(i, 1);
                            lr.splice(i, 1);
                        }
                        j++;
                    }
                }
                if (i < this.listafunciones.length) {
                    this.listafunciones.splice(i, this.listafunciones.length - i);
                }
            }
        }
    };
    Funcion.prototype.validarClase = function (original) {
        var i = 0;
        while (i < original.sentencias.length) {
            if (original.getSentencia(i).tipo == "CLASE")
                return original.getSentencia(i);
            i++;
        }
        return new Nodo_1.default("", "");
    };
    Funcion.prototype.verificarFunciones = function (original, lf, lp, lr) {
        var origen = this.validarClase(original);
        if (origen.sentencias.length != 0) {
            for (var index = 0; index < origen.sentencias.length; index++) {
                var funcion = origen.getSentencia(index);
                if (funcion.tipo == "FUNCION") {
                    if (funcion.valor.startsWith("boolean")) {
                        lf.push(funcion.valor.substring(8));
                        lr.push("boolean");
                    }
                    else if (funcion.valor.startsWith("int")) {
                        lf.push(funcion.valor.substring(4));
                        lr.push("int");
                    }
                    else if (funcion.valor.startsWith("char")) {
                        lf.push(funcion.valor.substring(5));
                        lr.push("char");
                    }
                    else if (funcion.valor.startsWith("String")) {
                        lf.push(funcion.valor.substring(7));
                        lr.push("String");
                    }
                    else if (funcion.valor.startsWith("double")) {
                        lf.push(funcion.valor.substring(7));
                        lr.push("double");
                    }
                    this.verificarParametros(funcion, lp);
                }
                else if (funcion.tipo == "METODO" || funcion.tipo == "MAIN") {
                    lf.push(funcion.valor);
                    lr.push("void");
                    this.verificarParametros(funcion, lp);
                }
            }
        }
        return origen;
    };
    Funcion.prototype.verificarParametros = function (funcion, lista) {
        var listaparam = "";
        for (var index = 0; index < funcion.sentencias.length; index++) {
            var parametro = funcion.getSentencia(index);
            if (parametro.tipo == "PARAMETRO") {
                listaparam += parametro.valor + " " + parametro.getSentencia(0).valor + ",";
            }
            else
                break;
        }
        if (listaparam == "")
            listaparam = " ";
        lista.push(listaparam);
    };
    return Funcion;
}());
exports.default = Funcion;
