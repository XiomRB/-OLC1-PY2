"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Nodo_1 = __importDefault(require("../Arbol/Nodo"));
var Variable = /** @class */ (function () {
    function Variable() {
        this.nombre = "---";
        this.variables = [];
    }
    Variable.prototype.verificarClase = function (original) {
        for (var index = 0; index < original.sentencias.length; index++) {
            if (original.getSentencia(index).tipo == "CLASE")
                return original.getSentencia(index);
        }
        return new Nodo_1.default("", "");
    };
    Variable.prototype.verificarFuncion = function (original, l) {
        var origen = this.verificarClase(original);
        for (var index = 0; index < origen.sentencias.length; index++) {
            var f = origen.getSentencia(index);
            if (f.tipo == "FUNCION" || f.tipo == "METODO" || f.tipo == "MAIN") {
                for (var i = 0; i < f.sentencias.length; i++) {
                    var v = f.getSentencia(i);
                    if (v.tipo == "DECLARACION") {
                        var nueva = new Var(v.valor, f.valor);
                        for (var j = 0; j < v.sentencias.length; j++) {
                            if (v.getSentencia(j).tipo == "VARIABLE")
                                nueva.nombre.push(v.getSentencia(j).valor);
                        }
                        l.push(nueva);
                    }
                }
            }
        }
        return origen;
    };
    Variable.prototype.verificar = function (original, copia) {
        var origen = this.verificarFuncion(original, this.variables);
        var l = [];
        var copy = this.verificarFuncion(copia, l);
        if (origen.valor == copy.valor) {
            this.nombre = origen.valor;
            var i = 0;
            while (i < this.variables.length && i < l.length) {
                if (this.variables[i].funcion == l[i].funcion) {
                    if (this.variables[i].tipo == l[i].tipo) {
                        if (JSON.stringify(this.variables[i].nombre) == JSON.stringify(l[i].nombre))
                            i++;
                        else {
                            var j = 0;
                            while (j < this.variables[i].nombre.length && j < l[i].nombre.length) {
                                if (this.variables[i].nombre[j] == l[i].nombre[j])
                                    i++;
                                else {
                                    this.variables.splice(i, 1);
                                    l.splice(i, 1);
                                }
                            }
                            if (j < this.variables[i].nombre.length) {
                                this.variables.splice(j, this.variables.length - j - 1); //borra las funciones que sobran en el original
                            }
                        }
                    }
                    else {
                        this.variables.splice(i, 1);
                        l.splice(i, 1);
                    }
                }
                else {
                    this.variables.splice(i, 1);
                    l.splice(i, 1);
                }
            }
            if (i < this.variables.length) {
                this.variables.splice(i, this.variables.length - i);
            }
        }
    };
    return Variable;
}());
exports.default = Variable;
var Var = /** @class */ (function () {
    function Var(t, f) {
        this.tipo = t;
        this.nombre = [];
        this.funcion = f;
    }
    return Var;
}());
