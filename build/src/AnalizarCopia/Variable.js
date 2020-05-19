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
                            if (v.getSentencia(j).tipo == "VARIABLE") {
                                var nuevavar = new ListaVar(v.getSentencia(j).valor);
                                nueva.nombre.push(nuevavar);
                            }
                        }
                        l.push(nueva);
                    }
                }
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
                    if ((this.variables[i].funcion == l[j].funcion) && (this.variables[i].tipo == l[j].tipo)) {
                        var k = void 0;
                        for (k = 0; k < this.variables[i].nombre.length; k++) {
                            var m = void 0;
                            for (m = 0; m < l[j].nombre.length; m++) {
                                if (this.variables[i].nombre[k].nombre == l[j].nombre[m].nombre) {
                                    this.variables[i].nombre[k].esCopia = true;
                                    break;
                                }
                            }
                        }
                        if (k != this.variables[i].nombre.length)
                            break;
                    }
                }
            }
        }
        else
            while (this.variables.length > 0)
                this.variables.pop();
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
var ListaVar = /** @class */ (function () {
    function ListaVar(name) {
        this.nombre = name;
        this.esCopia = false;
    }
    return ListaVar;
}());
