
class NodoError {
    constructor(tipo, descripcion, linea) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = (linea + 1);
    }
    gettipo() {
        return this.tipo;
    }
    getdescripcion() {
        return this.descripcion;
    }
    getlinea() {
        return this.linea;
    }
}
module.exports = NodoError;
