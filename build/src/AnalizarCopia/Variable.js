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
                var fm = new FuncionMetodo(f.valor);
                for (var i = 0; i < f.sentencias.length; i++) {
                    var v = f.getSentencia(i);
                    if (v.tipo == "PARAMETRO") {
                        fm.parametros.push(v.valor);
                    }
                    else {
                        this.verificarVariables(v, fm.variables);
                    }
                }
                /* for (let k = i; k < f.sentencias.length; k++) {
                     let v:Nodo = f.getSentencia(k)
                     this.verificarVariables(v,fm.variables)
                 }*/
                l.push(fm);
            }
        }
        return origen;
    };
    Variable.prototype.verificar = function (original, copia) {
        this.variables = [];
        var origen = this.verificarFuncion(original, this.variables);
        var l = [];
        var copy = this.verificarFuncion(copia, l);
        if (origen.valor == copy.valor) {
            this.nombre = origen.valor;
            for (var i = 0; i < this.variables.length; i++) {
                var j = void 0;
                for (j = 0; j < l.length; j++) {
                    if (this.variables[i].funcion == l[j].funcion) {
                        if (JSON.stringify(this.variables[i].parametros) == JSON.stringify(l[j].parametros)) {
                            var k = void 0;
                            for (k = 0; k < this.variables[i].variables.length; k++) {
                                var m = void 0;
                                for (m = 0; m < l[j].variables.length; m++) {
                                    if ((this.variables[i].variables[k].tipo == l[j].variables[m].tipo) && (this.variables[i].variables[k].nombre == l[j].variables[m].nombre)) {
                                        this.variables[i].variables[k].esCopia = true;
                                        break;
                                    }
                                }
                            }
                            if (k != this.variables[i].variables.length)
                                break;
                        }
                    }
                }
            }
        }
        else
            while (this.variables.length > 0)
                this.variables.pop();
    };
    Variable.prototype.verificarVariables = function (nodo, vrb) {
        if (nodo.tipo == "DECLARACION") {
            for (var j = 0; j < nodo.sentencias.length; j++) {
                if (nodo.getSentencia(j).tipo == "VARIABLE") {
                    var nuevavar = new ListaVar(nodo.getSentencia(j).valor, nodo.valor);
                    vrb.push(nuevavar);
                }
            }
        }
        else if (nodo.valor == "while" || nodo.valor == "if" || nodo.valor == "for" || nodo.valor == "do" || nodo.valor == "else") {
            for (var i = 0; i < nodo.sentencias.length; i++)
                this.verificarVariables(nodo.getSentencia(i), vrb);
        }
        else if (nodo.valor == "switch") {
            for (var j = 1; j < nodo.sentencias.length; j++) {
                for (var k = 0; k < nodo.getSentencia(j).sentencias.length; k++) {
                    this.verificarVariables(nodo.getSentencia(j).getSentencia(k), vrb);
                }
            }
        }
    };
    return Variable;
}());
exports.default = Variable;
var FuncionMetodo = /** @class */ (function () {
    function FuncionMetodo(f) {
        this.variables = [];
        this.funcion = f;
        this.parametros = [];
    }
    return FuncionMetodo;
}());
var ListaVar = /** @class */ (function () {
    function ListaVar(name, t) {
        this.nombre = name;
        this.esCopia = false;
        this.tipo = t;
    }
    return ListaVar;
}());
