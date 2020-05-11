var Nodo = /** @class */ (function () {
    function Nodo(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
        this.sentencias = [];
    }
    Nodo.prototype.getSentencia = function (indice) {
        return this.sentencias[indice];
    };
    Nodo.prototype.setHijos = function (sentencias) {
        this.sentencias = sentencias;
    };
    Nodo.prototype.agregarHijos = function (sentencias) {
        for (var i = 0; i < sentencias.length; i++)
            this.sentencias.push(sentencias[i]);
    };
    return Nodo;
}());
module.exports = Nodo;
