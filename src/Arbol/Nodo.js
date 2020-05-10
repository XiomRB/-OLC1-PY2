class Nodo{
    constructor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
        this.sentencias = [];
    }

    getSentencia(indice) {
        return this.sentencias[indice];
    }

    setHijos(sentencias){
        this.sentencias = sentencias;
    }

    agregarHijos(sentencias){
        for(let i = 0; i < sentencias.length;i++) this.sentencias.push(sentencias[i]);
    }
}
exports.default = Nodo;
