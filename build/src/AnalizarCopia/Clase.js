"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClaseCopia = /** @class */ (function () {
    function ClaseCopia() {
        this.nombre = "";
        this.metodos = 0;
        this.funciones = 0;
        this.clasecopia = true;
    }
    ClaseCopia.prototype.verificar = function (original, copia) {
        var tablaoriginal = this.verificarClase(original);
        var tablacopia = this.verificarClase(copia);
        if (tablaoriginal.length == tablacopia.length) {
            if (JSON.stringify(tablaoriginal[0]) == JSON.stringify(tablacopia[0])) {
                this.nombre = tablaoriginal[0].nombre;
                for (var index = 1; index < tablaoriginal.length; index++) {
                    var j = void 0;
                    for (j = 1; j < tablacopia.length; j++) {
                        if (JSON.stringify(tablaoriginal[index]) == JSON.stringify(tablacopia[j])) {
                            if (tablaoriginal[index].tipo == "FUNCION")
                                this.funciones++;
                            else
                                this.metodos++;
                            break;
                        }
                    }
                    if (j == tablacopia.length) {
                        this.clasecopia = false;
                        return;
                    }
                }
            }
            else {
                this.clasecopia = false;
                return;
            }
        }
        else {
            this.clasecopia = false;
            return;
        }
    };
    ClaseCopia.prototype.verificarClase = function (original) {
        var tabla = [];
        for (var index = 0; index < original.sentencias.length; index++) {
            var nodo = original.getSentencia(index);
            if (nodo.tipo == "CLASE") {
                tabla.push(new Objeto(nodo.tipo, nodo.valor));
                this.llenarTabla(nodo, tabla);
            }
        }
        return tabla;
    };
    ClaseCopia.prototype.llenarTabla = function (original, tabla) {
        for (var index = 0; index < original.sentencias.length; index++) {
            var nodo = original.getSentencia(index);
            if (nodo.tipo == "METODO" || nodo.tipo == "FUNCION" || nodo.tipo == "MAIN") {
                var fm = new Objeto(nodo.tipo, nodo.valor);
                for (var j = 0; j < nodo.sentencias.length; j++) {
                    if (nodo.getSentencia(j).tipo == "PARAMETRO")
                        fm.parametros.push(nodo.getSentencia(j).valor);
                    else
                        break;
                }
                tabla.push(fm);
            }
        }
    };
    return ClaseCopia;
}());
exports.default = ClaseCopia;
var Objeto = /** @class */ (function () {
    function Objeto(t, n) {
        this.tipo = t;
        this.nombre = n;
        this.parametros = [];
    }
    return Objeto;
}());
