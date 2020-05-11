"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser = require("./gramatica").parser;
/*function exec (input:string) {
    return parser.parse(input);
}

var twenty = exec("int id");
console.log(twenty.valor);*/
var analizador = /** @class */ (function () {
    function analizador(entrada) {
        this.raiz = this.ejecutarAnalizador(entrada);
    }
    analizador.prototype.ejecutarAnalizador = function (entrada) {
        return parser.parse(entrada);
    };
    analizador.prototype.imprimirArbol = function (root) {
        var _this = this;
        if (root != null) {
            console.log(root.tipo);
            root.sentencias.forEach(function (sentencia) {
                _this.imprimirArbol(sentencia);
            });
        }
    };
    analizador.prototype.verArbol = function () {
        this.imprimirArbol(this.raiz);
    };
    return analizador;
}());
var analiza = new analizador("int id1,id2,id3");
analiza.verArbol();
