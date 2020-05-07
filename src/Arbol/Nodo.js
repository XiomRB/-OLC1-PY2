"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Nodo {
    constructor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
        this.sentencias = [];
    }
    getSentencia(indice) {
        return this.sentencias[indice];
    }
}
exports.default = Nodo;
